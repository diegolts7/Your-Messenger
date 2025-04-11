import { User } from "@prisma/client";
import { prisma } from "../../config/db/db";
import { CreateUser, EditUser } from "../../utils/types/user/user";

export class UserRepository {
  static async findById(id: number) {
    return await prisma.user.findUnique({ where: { id } });
  }

  static async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  static async findByHandle(handle: string) {
    return await prisma.user.findUnique({ where: { handle } });
  }

  static async findManyWithCondition(data: Partial<User>) {
    return await prisma.user.findMany({ where: data });
  }

  static async createUser(data: CreateUser) {
    return await prisma.user.create({ data });
  }

  static async editUser(id: number, data: EditUser) {
    return await prisma.user.update({ data, where: { id } });
  }
}
