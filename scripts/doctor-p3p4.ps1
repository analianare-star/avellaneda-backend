$ErrorActionPreference = "Stop"

function Fail($message) {
  Write-Host $message -ForegroundColor Red
  throw $message
}

function Run-Step($label, $command) {
  Write-Host "`n[$label] $command" -ForegroundColor Yellow
  $global:LASTEXITCODE = 0
  Invoke-Expression $command
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed ($LASTEXITCODE): $command"
  }
}

function Load-DotEnv($path) {
  if (-not (Test-Path $path)) { return }
  Get-Content $path | ForEach-Object {
    $line = $_.Trim()
    if ($line.Length -eq 0) { return }
    if ($line.StartsWith("#")) { return }
    $parts = $line.Split("=", 2)
    if ($parts.Length -ne 2) { return }
    $name = $parts[0].Trim()
    $value = $parts[1].Trim().Trim("'").Trim('"')
    if ($name.Length -gt 0) {
      [Environment]::SetEnvironmentVariable($name, $value)
    }
  }
}

function Normalize-DbUrl($url) {
  if (-not $url) { return $url }
  if ($url -notmatch "\?") { return $url }
  $clean = $url -replace "([?&])schema=[^&]*", ""
  $clean = $clean -replace "\?&", "?"
  $clean = $clean.TrimEnd("?", "&")
  return $clean
}

function Get-WeekKey([datetime]$date) {
  $start = Get-Date $date
  $day = [int]$start.DayOfWeek
  $diff = if ($day -eq 0) { -6 } else { 1 - $day }
  $start = $start.AddDays($diff)
  $start = Get-Date $start -Hour 0 -Minute 0 -Second 0 -Millisecond 0
  return $start.ToString("yyyy-MM-dd")
}

function Get-DayKey([datetime]$date) {
  return (Get-Date $date).ToString("yyyy-MM-dd")
}

$repoRoot = Join-Path $PSScriptRoot ".."
Set-Location $repoRoot

if (-not (Test-Path ".\\package.json")) { Fail "package.json not found. Run from avellaneda-backend." }
if (-not (Test-Path ".\\prisma\\schema.prisma")) { Fail "prisma\\schema.prisma not found." }
if (-not (Test-Path ".\\node_modules")) { Fail "node_modules not found. Run npm install first." }

Write-Host "=== DOCTOR P3+P4 (BACKEND) ===" -ForegroundColor Cyan
Write-Host "Repo: $repoRoot" -ForegroundColor DarkGray

Run-Step "0/6" "node -v"
Run-Step "0/6" "npm -v"

try {
  Run-Step "1/6" "npx prisma generate"
} catch {
  if ($_.Exception.Message -match "EPERM" -or $_.Exception.Message -match "query_engine") {
    Write-Host "Prisma generate failed due to locked engine. Close running servers and retry." -ForegroundColor Red
  }
  throw
}

Run-Step "2/6" "npm run backfill:authusers"
Run-Step "3/6" "npm run backfill:quotawallets"

$psql = Get-Command psql -ErrorAction SilentlyContinue
$weekKey = Get-WeekKey (Get-Date)
$dayKey = Get-DayKey (Get-Date)

$manualSql = @"
-- VALIDACIONES PASO 3 + 4
-- week_key = $weekKey
-- day_key = $dayKey

SELECT 'shops_without_authuser' AS check, COUNT(*)::int AS value
FROM "Shop"
WHERE "authUserId" IS NULL;

SELECT 'shop_authuser_missing' AS check, COUNT(*)::int AS value
FROM "Shop" s
LEFT JOIN "AuthUser" a ON a.id = s."authUserId"
WHERE s."authUserId" IS NOT NULL AND a.id IS NULL;

SELECT 'authuser_shop_without_shop' AS check, COUNT(*)::int AS value
FROM "AuthUser" a
LEFT JOIN "Shop" s ON s."authUserId" = a.id
WHERE a."userType" = 'SHOP' AND s.id IS NULL;

SELECT 'shops_without_wallet' AS check, COUNT(*)::int AS value
FROM "Shop" s
LEFT JOIN "QuotaWallet" w ON w."shopId" = s.id
WHERE w."shopId" IS NULL;

SELECT 'wallet_duplicates' AS check, COUNT(*)::int AS value
FROM (
  SELECT "shopId", COUNT(*) c
  FROM "QuotaWallet"
  GROUP BY "shopId"
  HAVING COUNT(*) > 1
) x;

SELECT 'authuser_email_duplicates' AS check, COUNT(*)::int AS value
FROM (
  SELECT email, COUNT(*) c
  FROM "AuthUser"
  GROUP BY email
  HAVING COUNT(*) > 1
) x;

SELECT 'authuser_bad_domain' AS check, COUNT(*)::int AS value
FROM "AuthUser"
WHERE email LIKE '%@local.invalid';

SELECT 'tech_email_without_flag' AS check, COUNT(*)::int AS value
FROM "Shop" s
JOIN "AuthUser" a ON a.id = s."authUserId"
WHERE a.email LIKE 'shop_%@invalid.local' AND s."requiresEmailFix" = false;

SELECT 'wallet_negative_values' AS check, COUNT(*)::int AS value
FROM "QuotaWallet"
WHERE "weeklyLiveBaseLimit" < 0 OR "weeklyLiveUsed" < 0 OR "liveExtraBalance" < 0
   OR "reelDailyLimit" < 0 OR "reelDailyUsed" < 0 OR "reelExtraBalance" < 0;

SELECT 'wallet_used_gt_limit' AS check, COUNT(*)::int AS value
FROM "QuotaWallet"
WHERE "weeklyLiveUsed" > "weeklyLiveBaseLimit" OR "reelDailyUsed" > "reelDailyLimit";

SELECT 'legacy_stream_quota_mismatch' AS check, COUNT(*)::int AS value
FROM "Shop" s
JOIN "QuotaWallet" w ON w."shopId" = s.id
WHERE w."weeklyLiveWeekKey" = '$weekKey'
  AND s."streamQuota" <> (w."weeklyLiveBaseLimit" - w."weeklyLiveUsed" + w."liveExtraBalance");

SELECT 'legacy_reel_quota_mismatch' AS check, COUNT(*)::int AS value
FROM "Shop" s
JOIN "QuotaWallet" w ON w."shopId" = s.id
WHERE w."reelDailyDateKey" = '$dayKey'
  AND s."reelQuota" <> (w."reelDailyLimit" - w."reelDailyUsed" + w."reelExtraBalance");
"@

if ($psql) {
  Write-Host "`n[4/6] Validations via psql..." -ForegroundColor Yellow
  Load-DotEnv ".\\.env"
  $dbUrl = [Environment]::GetEnvironmentVariable("DATABASE_URL")
  if (-not $dbUrl) { Fail "DATABASE_URL not found. Check .env." }
  $originalDbUrl = $dbUrl
  $dbUrl = Normalize-DbUrl $dbUrl
  if ($dbUrl -ne $originalDbUrl) {
    Write-Host "DATABASE_URL sanitized for psql (schema param removed)." -ForegroundColor DarkGray
  }

  $checksSql = $manualSql -replace "-- VALIDACIONES PASO 3 \\+ 4", "-- CHECKS ONLY"

  $out = $checksSql | & psql --dbname="$dbUrl" -X -v ON_ERROR_STOP=1 -t -A
  if ($LASTEXITCODE -ne 0) { Fail "psql failed. Verify DATABASE_URL or table quoting." }
  if (-not $out) { Fail "psql returned no output." }
  Write-Host $out

  $fail = $false
  $out.Split("`n") | ForEach-Object {
    $line = $_.Trim()
    if (-not $line) { return }
    $parts = $line.Split("|")
    if ($parts.Length -ne 2) { return }
    $check = $parts[0]
    $val = [int]$parts[1]
    if ($val -ne 0) {
      Write-Host "FAIL: $check = $val (must be 0)" -ForegroundColor Red
      $fail = $true
    } else {
      Write-Host "OK: $check = 0" -ForegroundColor Green
    }
  }

  if ($fail) { throw "DB validation failed. Fix the checks above." }
} else {
  Write-Host "`n[4/6] psql not found. Paste in pgAdmin4:" -ForegroundColor Cyan
  Write-Host $manualSql -ForegroundColor Gray
}

Write-Host "`n[6/6] DONE" -ForegroundColor Green
