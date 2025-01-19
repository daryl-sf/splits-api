import { PrismaClient, Club as TClub } from "@prisma/client";

const prisma = new PrismaClient();

export class Club {
  static async create(name: TClub['name'], bio: TClub['bio'], userId: TClub['ownerId']) {
    return prisma.club.create({
      data: {
        name,
        bio,
        owner: {
          connect: {
            id: userId,
          },
        },
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
