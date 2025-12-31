import prisma from '../../prisma/client';

export const getAgendaByUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      agenda: {
        include: { stream: true } // Incluimos los detalles del vivo para verlos en la agenda
      },
    },
  });
};

export const addToAgenda = async (userId: string, streamId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      agenda: {
        // Como Agenda es una tabla explícita, usamos 'create' vinculando el stream
        create: {
          stream: {
            connect: { id: streamId }
          }
        }
      },
    },
  });
};

export const removeFromAgenda = async (userId: string, streamId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      agenda: {
        // Usamos deleteMany dentro del update para borrar la entrada específica de ese stream
        deleteMany: {
          streamId: streamId
        }
      },
    },
  });
};
