import prisma from '../../prisma/client';

export const getReviewsByStream = async (streamId: string) => {
  return prisma.review.findMany({
    where: { streamId },
    orderBy: { createdAt: 'desc' },
  });
};

export const createReview = async (streamId: string, data: any) => {
  const rating = Number(data?.rating);
  return prisma.review.create({
    data: {
      streamId,
      rating: isNaN(rating) ? 0 : rating,
      comment: data?.comment,
    },
  });
};
