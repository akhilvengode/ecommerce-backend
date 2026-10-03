import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import { AppError } from "../../common/errors/appError";
import jwt from "jsonwebtoken";

class AuthService {
  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      }
    );

    // Return safe user (no password)
    const { password: _, ...safeUser } = user;

    return {
        user: safeUser,
        token
    }
  }
}

export const authService = new AuthService();
