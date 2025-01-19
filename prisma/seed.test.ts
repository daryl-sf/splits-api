import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  // clear the database
  await prisma.club.deleteMany();
  await prisma.user.deleteMany();

  // create a user
  const owner = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "jd@example.com",
      password: "password123",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "New Guy",
      email: "ng@example.com",
      password: "password123",
    },
  });

  // create a club
  await prisma.club.create({
    data: {
      name: "Club 1",
      bio: "This is a club",
      owner: {
        connect: {
          id: owner.id,
        },
      },
      members: {
        connect: [
          {
            id: owner.id,
          },
          {
            id: user.id,
          }
        ],
      }
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🌳 Seeding complete.");
  });
