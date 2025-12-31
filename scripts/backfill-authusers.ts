import 'dotenv/config';
import { AuthUserStatus, AuthUserType, ShopStatus } from '@prisma/client';
import { randomBytes, scryptSync } from 'crypto';
import prisma from '../prisma/client';

const TECH_EMAIL_DOMAIN = 'invalid.local';

const normalizeEmail = (value: unknown) => String(value || '').trim().toLowerCase();

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const buildTechnicalEmail = (shopId: string) => `shop_${shopId}@${TECH_EMAIL_DOMAIN}`;

const hashPassword = (value?: string | null) => {
  if (!value) return null;
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(value, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
};

const resolveAuthUserStatus = (status: ShopStatus | null | undefined, active?: boolean) => {
  if (status === ShopStatus.BANNED || status === ShopStatus.HIDDEN) return AuthUserStatus.SUSPENDED;
  if (active === false) return AuthUserStatus.SUSPENDED;
  return AuthUserStatus.ACTIVE;
};

type ShopRow = {
  id: string;
  email: string | null;
  password: string | null;
  createdAt: Date | null;
  status: ShopStatus;
  active: boolean;
  authUserId: string | null;
  requiresEmailFix: boolean;
};

const compareShopAge = (a: ShopRow, b: ShopRow) => {
  const aTime = a.createdAt?.getTime();
  const bTime = b.createdAt?.getTime();
  if (aTime !== undefined && bTime !== undefined && aTime !== bTime) return aTime - bTime;
  if (aTime !== undefined && bTime === undefined) return -1;
  if (aTime === undefined && bTime !== undefined) return 1;
  return a.id.localeCompare(b.id);
};

const main = async () => {
  const shops = await prisma.shop.findMany({
    select: {
      id: true,
      email: true,
      password: true,
      createdAt: true,
      status: true,
      active: true,
      authUserId: true,
      requiresEmailFix: true,
    },
  });

  const emailGroups = new Map<string, ShopRow[]>();
  shops.forEach((shop) => {
    const normalized = normalizeEmail(shop.email);
    if (!isValidEmail(normalized)) return;
    if (!emailGroups.has(normalized)) {
      emailGroups.set(normalized, []);
    }
    emailGroups.get(normalized)?.push(shop);
  });

  const keepEmailForShop = new Map<string, string>();
  const duplicateShopIds = new Set<string>();

  emailGroups.forEach((group, email) => {
    if (group.length <= 1) {
      keepEmailForShop.set(group[0].id, email);
      return;
    }
    const sorted = [...group].sort(compareShopAge);
    const keeper = sorted[0];
    keepEmailForShop.set(keeper.id, email);
    sorted.slice(1).forEach((shop) => duplicateShopIds.add(shop.id));
  });

  let createdCount = 0;
  let updatedCount = 0;

  for (const shop of shops) {
    const normalized = normalizeEmail(shop.email);
    const hasValidEmail = isValidEmail(normalized);
    const isDuplicate = duplicateShopIds.has(shop.id);
    let authEmail = keepEmailForShop.get(shop.id) || normalized;
    let requiresEmailFix = false;

    if (!hasValidEmail || isDuplicate) {
      authEmail = buildTechnicalEmail(shop.id);
      requiresEmailFix = true;
    }

    if (!requiresEmailFix) {
      const existingAuthUser = await prisma.authUser.findUnique({ where: { email: authEmail } });
      if (existingAuthUser) {
        authEmail = buildTechnicalEmail(shop.id);
        requiresEmailFix = true;
      }
    }

    const status = resolveAuthUserStatus(shop.status, shop.active);
    const passwordHash = hashPassword(shop.password);

    if (shop.authUserId) {
      const existing = await prisma.authUser.findUnique({ where: { id: shop.authUserId } });
      if (existing) {
        await prisma.authUser.update({
          where: { id: shop.authUserId },
          data: { status },
        });
        if (requiresEmailFix && !shop.requiresEmailFix) {
          await prisma.shop.update({
            where: { id: shop.id },
            data: { requiresEmailFix: true },
          });
          updatedCount += 1;
        }
        continue;
      }
    }

    const createdAuthUser = await prisma.authUser.create({
      data: {
        email: authEmail,
        passwordHash,
        userType: AuthUserType.SHOP,
        status,
      },
    });

    await prisma.shop.update({
      where: { id: shop.id },
      data: {
        authUserId: createdAuthUser.id,
        requiresEmailFix,
      },
    });

    createdCount += 1;
  }

  console.log(`AuthUser creados: ${createdCount}`);
  console.log(`Shops actualizados (requiresEmailFix): ${updatedCount}`);
};

main()
  .catch((error) => {
    console.error('Error en backfill:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
