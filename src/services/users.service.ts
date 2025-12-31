import prisma from '../../prisma/client';

export const getUsers = async () => {
  return prisma.user.findMany({
    include: {
      favorites: true,
      agenda: true,
    },
  });
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      favorites: true,
      agenda: true,
    },
  });
};

export const createUser = async (data: any) => {
  return prisma.user.create({ data });
};

export const updateUser = async (id: string, data: any) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const addFavoriteShop = async (userId: string, shopId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      favorites: {
        connect: { id: shopId },
      },
    },
  });
};

export const removeFavoriteShop = async (userId: string, shopId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      favorites: {
        disconnect: { id: shopId },
      },
    },
  });
};

export const addToAgenda = async (userId: string, streamId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      agenda: {
        connect: { id: streamId },
      },
    },
  });
};

export const removeFromAgenda = async (userId: string, streamId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      agenda: {
        disconnect: { id: streamId },
      },
    },
  });
};
