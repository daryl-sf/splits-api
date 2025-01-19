import { beforeEach } from 'node:test';

import { User } from '@models/user';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { test, expect, afterAll, describe } from 'vitest';


const prisma = new PrismaClient();

const reset = async () => {
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: 'test',
      },
    },
  });
};

describe('User', () => {
  beforeEach(async () => {
    await reset();
  });

  afterAll(async () => {
    await reset();
    await prisma.$disconnect();
  });

  const createTestUser = async () => {
    const user = await User.create('Test User', 'testuser@test.com', 'password123');
    return user;
  };

  test('create should create a user without returning the password', async () => {
    const user = await createTestUser();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name', 'Test User');
    expect(user).toHaveProperty('email', 'testuser@test.com');
    expect(user).not.toHaveProperty('password');
  });

  test('getUserByEmail should return a user by email', async () => {
    const email = 'jd@example.com';
    const user = await User.getUserByEmail(email);
    expect(user).toHaveProperty('email', email);
  });

  test('getUserById should return a user by id', async () => {
    const createdUser = await createTestUser();
    const user = await User.getUserById(createdUser.id);
    expect(user).toHaveProperty('id', createdUser.id);
  });

  test('validatePassword should validate the password correctly', async () => {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const isValid = await User.validatePassword(password, hashedPassword);
    expect(isValid).toBe(true);
  });

  test('getValidatedUser should return user without password if credentials are correct', async () => {
    const createUser = await createTestUser();
    const email = createUser.email;
    const password = 'password123';
    const user = await User.getValidatedUser(email, password);
    expect(user).toHaveProperty('email', email);
    expect(user).not.toHaveProperty('password');
  });

  test('getValidatedUser should return null if credentials are incorrect', async () => {
    const email = 'jd@example.com';
    const password = 'wrongpassword';
    const user = await User.getValidatedUser(email, password);
    expect(user).toBeNull();
  });
});
