import { User } from "@prisma/client";
import { prisma } from "../../config/db/db";
import {
  CreateUser,
  customSelectUser,
  EditUser,
} from "../../utils/types/user/user";
import { IUserRepository } from "./interface/IUserRepository";

export class UserPrismaRepository implements IUserRepository {
  async findById(id: number, select?: Partial<customSelectUser>) {
    const hasSelect = select && Object.keys(select).length > 0;

    return await prisma.user.findUnique({
      where: { id },
      ...(hasSelect ? { select } : {}),
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async findByHandle(handle: string) {
    return await prisma.user.findUnique({ where: { handle } });
  }

  async findManyWithCondition(data: Partial<User>) {
    return await prisma.user.findMany({ where: data });
  }

  async createUser(data: CreateUser) {
    return await prisma.user.create({ data });
  }

  async editUser(id: number, data: EditUser) {
    return await prisma.user.update({ data, where: { id } });
  }
}
