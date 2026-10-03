import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";

class UserService {
  async createUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  async getUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
}

export const userService = new UserService();