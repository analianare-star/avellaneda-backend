import 'dotenv/config';
import {
  QuotaActorType,
  QuotaDirection,
  QuotaReason,
  QuotaRefType,
  QuotaResource,
} from '@prisma/client';
import prisma from '../prisma/client';
import { buildWalletFromLegacy } from '../src/services/quota.service';

const main = async () => {
  const shops = await prisma.shop.findMany({
    select: {
      id: true,
      plan: true,
      streamQuota: true,
      reelQuota: true,
    },
  });

  let created = 0;
  let skipped = 0;
  let transactionCount = 0;
  const now = new Date();

  for (const shop of shops) {
    const existingWallet = await prisma.quotaWallet.findUnique({ where: { shopId: shop.id } });
    if (existingWallet) {
      skipped += 1;
      continue;
    }

    const computed = buildWalletFromLegacy(shop.plan, shop.streamQuota, shop.reelQuota, now);

    await prisma.$transaction(async (tx) => {
      await tx.quotaWallet.create({
        data: {
          shopId: shop.id,
          ...computed.walletData,
        },
      });

      await tx.shop.update({
        where: { id: shop.id },
        data: computed.legacyTotals,
      });

      if (computed.extraBalances.liveExtraBalance > 0) {
        await tx.quotaTransaction.create({
          data: {
            shopId: shop.id,
            resource: QuotaResource.LIVE,
            direction: QuotaDirection.CREDIT,
            amount: computed.extraBalances.liveExtraBalance,
            reason: QuotaReason.LEGACY_MIGRATION,
            refType: QuotaRefType.SYSTEM,
            actorType: QuotaActorType.SYSTEM,
          },
        });
        transactionCount += 1;
      }

      if (computed.extraBalances.reelExtraBalance > 0) {
        await tx.quotaTransaction.create({
          data: {
            shopId: shop.id,
            resource: QuotaResource.REEL,
            direction: QuotaDirection.CREDIT,
            amount: computed.extraBalances.reelExtraBalance,
            reason: QuotaReason.LEGACY_MIGRATION,
            refType: QuotaRefType.SYSTEM,
            actorType: QuotaActorType.SYSTEM,
          },
        });
        transactionCount += 1;
      }
    });

    created += 1;
  }

  console.log(`Wallets creadas: ${created}`);
  console.log(`Wallets existentes (skip): ${skipped}`);
  console.log(`Transacciones legacy creadas: ${transactionCount}`);
};

main()
  .catch((error) => {
    console.error('Error en backfill:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
