import { prisma } from "../../config/db/db";
import { RegisterBodyType } from "../../schemas/auth/register.schema";

export class AuthRepository {
  static async checkEmailAndHandle({
    email,
    handle,
  }: Omit<RegisterBodyType, "name">) {
    const [emailExists, handleExists] = await prisma.$transaction([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { handle } }),
    ]);

    return { emailExists, handleExists };
  }
}
