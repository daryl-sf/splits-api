import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { test, expect, beforeAll, afterAll } from 'vitest';

import { User } from '@models/user';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: 'example.com',
      },
    },
  }); // Clear the database before tests
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('create should create a user without returning the password', async () => {
  const user = await User.create('John Doe', 'john@example.com', 'password123');
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('name', 'John Doe');
  expect(user).toHaveProperty('email', 'john@example.com');
  expect(user).not.toHaveProperty('password');
});

test('getUserByEmail should return a user by email', async () => {
  await User.create('John Doe', 'john@example.com', 'password123');
  const email = 'john@example.com';
  const user = await User.getUserByEmail(email);
  expect(user).toHaveProperty('email', email);
});

test('getUserById should return a user by id', async () => {
  const createdUser = await User.create('Jane Doe', 'jane@example.com', 'password123');
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
  await User.create('John Doe', 'john@example.com', 'password123');
  const email = 'john@example.com';
  const password = 'password123';
  const user = await User.getValidatedUser(email, password);
  expect(user).toHaveProperty('email', email);
  expect(user).not.toHaveProperty('password');
});

test('getValidatedUser should return null if credentials are incorrect', async () => {
  const email = 'john@example.com';
  const password = 'wrongpassword';
  const user = await User.getValidatedUser(email, password);
  expect(user).toBeNull();
});
