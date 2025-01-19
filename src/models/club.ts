import { PrismaClient, Club as TClub } from "@prisma/client";

const prisma = new PrismaClient();

export class Club {
  static async create(name: TClub['name'], bio: TClub['bio'], ownerId: TClub['ownerId']) {
    return prisma.club.create({
      data: {
        name,
        bio,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        members: {
          connect: {
            id: ownerId,
          },
        },
      },
    });
  }

  static async getClubById(id: TClub['id']) {
    return prisma.club.findUnique({
      where: {
        id,
      },
    });
  }

  static async joinClub(userId: TClub['ownerId'], clubId: TClub['id']) {
    return prisma.club.update({
      where: {
        id: clubId,
      },
      data: {
        members: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  static async getClubs(userId: TClub['ownerId']) {
    return prisma.club.findMany({
      where: {
        OR: [
          {
            members: {
              some: {
                id: userId,
              },
            },
          },
          {
            ownerId: userId,
          },
        ],
      },
    });
  }

  static async getOwnedClubs(userId: TClub['ownerId']) {
    return prisma.club.findMany({
      where: {
        ownerId: userId,
      },
    });
  }
}
