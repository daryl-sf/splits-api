import { PrismaClient, User } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

export type UserWithOutPassword = Omit<User, 'password'>;

export const createUser = async (name: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { password: _, ...user } = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profile: {
        create: {}
      }
    },
  });
  return user as UserWithOutPassword;
};

export const getUserByEmail = async (email: User['email']) => {
  return prisma.user.findUnique({
    where: {
      email
    }
  });
};

export const getUserById = async (id: User['id']) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export const validatePassword = (password: User['password'], hashedPassword: User['password']) => {
  return bcrypt.compare(password, hashedPassword);
};

export const getValidatedUser = async (email: User['email'], password: User['password']) => {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }
  if (await validatePassword(password, user.password)) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as UserWithOutPassword;
  } else {
    return null;
  }
}
