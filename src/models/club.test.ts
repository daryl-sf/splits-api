import { Club } from "@models/club";
import { User } from "@models/user";
import { PrismaClient } from "@prisma/client";
import { afterAll, beforeEach, describe, expect, test } from "vitest";


const prisma = new PrismaClient();

const reset = async () => {
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: 'test',
      },
    },
  });
  await prisma.club.deleteMany({
    where: {
      name: {
        contains: "Test Club",
      },
    },
  });
};

describe("Club", () => {
  beforeEach(async () => {
    await reset();
  });

  afterAll(async () => {
    await reset();
    await prisma.$disconnect();
  });

  test("create should create a club", async () => {
    const user = await User.getUserByEmail("jd@example.com");
    // !. is used to assert that user is not null since we know that the user exists in the database
    // if it doesn't then seeds are broken or something has deleted the user from the database which is not expected
    const club = await Club.create("Test Club", "This is a club", user!.id);
    expect(club).toHaveProperty("id");
    expect(club).toHaveProperty("name", "Test Club");
    expect(club).toHaveProperty("bio", "This is a club");
    expect(club).toHaveProperty("ownerId", user!.id);
  });

  test("getClubs should return clubs that the user is an owner or member of", async () => {
    const member = await User.getUserByEmail("ng@example.com");
    const owner = await User.getUserByEmail("jd@example.com");

    // !. is used to assert that user is not null since we know that the user exists in the database
    // if it doesn't then seeds are broken or something has deleted the user from the database which is not expected
    const clubs = await Club.getClubs(member!.id);
    expect(clubs).toHaveLength(1);

    const ownedClubs = await Club.getClubs(owner!.id);
    expect(ownedClubs).toHaveLength(1);
  });

  test("joinClub should add a user to a club", async () => {
    const user = await User.create("New User", "nu@test.com", "password123");
    expect(await Club.getClubs(user.id)).toHaveLength(0);
    const club = await prisma.club.findFirst();
    await Club.joinClub(user.id, club!.id);
    expect(await Club.getClubs(user.id)).toHaveLength(1);
  });

  test("getClubById should return a club by id", async () => {
    const club = await prisma.club.findFirst();
    const foundClub = await Club.getClubById(club!.id);
    expect(foundClub).toHaveProperty("id", club!.id);
  });

  test("getOwnedClubs should return clubs that the user owns", async () => {
    const user = await User.getUserByEmail("jd@example.com");
    const clubs = await Club.getOwnedClubs(user!.id);
    expect(clubs).toHaveLength(1);
  });
});
