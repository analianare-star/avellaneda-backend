import prisma from '../../prisma/client';

export const getTestPanelData = async () => {
  return {
    streams: await prisma.stream.count(),
    reels: await prisma.reel.count(),
    shops: await prisma.shop.count(),
    users: await prisma.user.count(),
    reports: await prisma.report.count(),
  };
};

export const resetTestPanel = async () => {
  await prisma.agenda.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.report.deleteMany();
  await prisma.penalty.deleteMany();

  await prisma.stream.deleteMany();
  await prisma.reel.deleteMany();
  await prisma.shopSocialHandle.deleteMany();
  await prisma.shopWhatsappLine.deleteMany();

  await prisma.user.deleteMany();
  await prisma.shop.deleteMany();

  return { reset: true };
};
