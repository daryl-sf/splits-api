import { PrismaClient, User as TUser } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

export type UserWithOutPassword = Omit<TUser, 'password'>;

export class User {
  static async create(name: TUser['name'], email: TUser['email'], password: TUser['password']) {
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
  }

  static async getUserByEmail(email: TUser['email']) {
    return prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  static async getUserById(id: TUser['id']) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  static async validatePassword(password: TUser['password'], hashedPassword: TUser['password']): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async getValidatedUser(email: TUser['email'], password: TUser['password']) {
    const user = await User.getUserByEmail(email);
    if (!user) {
      return null;
    }
    if (await this.validatePassword(password, user.password)) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as UserWithOutPassword;
    } else {
      return null;
    }
  }
}
