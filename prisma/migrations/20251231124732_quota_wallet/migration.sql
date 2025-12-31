-- CreateEnum
CREATE TYPE "QuotaResource" AS ENUM ('LIVE', 'REEL');

-- CreateEnum
CREATE TYPE "QuotaDirection" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "QuotaReason" AS ENUM ('PLAN_BASE', 'PURCHASE', 'MANUAL_COMP', 'MISSED_BURN', 'CANCEL_BURN', 'REPROGRAM', 'ADMIN_OVERRIDE', 'EXPIRED_REEL', 'LEGACY_MIGRATION');

-- CreateEnum
CREATE TYPE "QuotaRefType" AS ENUM ('PURCHASE', 'LIVE', 'ADMIN', 'SYSTEM');

-- CreateEnum
CREATE TYPE "QuotaActorType" AS ENUM ('ADMIN', 'SHOP', 'SYSTEM');

-- CreateEnum
CREATE TYPE "PurchaseType" AS ENUM ('LIVE_PACK', 'REEL_PACK', 'PLAN_UPGRADE');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "QuotaWallet" (
    "shopId" TEXT NOT NULL,
    "weeklyLiveBaseLimit" INTEGER NOT NULL,
    "weeklyLiveUsed" INTEGER NOT NULL,
    "weeklyLiveWeekKey" TEXT NOT NULL,
    "liveExtraBalance" INTEGER NOT NULL,
    "reelDailyLimit" INTEGER NOT NULL,
    "reelDailyUsed" INTEGER NOT NULL,
    "reelDailyDateKey" TEXT NOT NULL,
    "reelExtraBalance" INTEGER NOT NULL,

    CONSTRAINT "QuotaWallet_pkey" PRIMARY KEY ("shopId")
);

-- CreateTable
CREATE TABLE "QuotaTransaction" (
    "txnId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "resource" "QuotaResource" NOT NULL,
    "direction" "QuotaDirection" NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" "QuotaReason" NOT NULL,
    "refType" "QuotaRefType",
    "refId" TEXT,
    "actorType" "QuotaActorType" NOT NULL,
    "actorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuotaTransaction_pkey" PRIMARY KEY ("txnId")
);

-- CreateTable
CREATE TABLE "PurchaseRequest" (
    "purchaseId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "type" "PurchaseType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "approvedByAdminId" TEXT,
    "paymentProofUrl" TEXT,
    "notes" TEXT,

    CONSTRAINT "PurchaseRequest_pkey" PRIMARY KEY ("purchaseId")
);

-- AddForeignKey
ALTER TABLE "QuotaWallet" ADD CONSTRAINT "QuotaWallet_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotaTransaction" ADD CONSTRAINT "QuotaTransaction_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequest" ADD CONSTRAINT "PurchaseRequest_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequest" ADD CONSTRAINT "PurchaseRequest_approvedByAdminId_fkey" FOREIGN KEY ("approvedByAdminId") REFERENCES "Admin"("authUserId") ON DELETE SET NULL ON UPDATE CASCADE;
