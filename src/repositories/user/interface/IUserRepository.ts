// IUserRepository.ts
import { User } from "@prisma/client";
import {
  CreateUser,
  customSelectUser,
  EditUser,
} from "../../../utils/types/user/user";

export interface IUserRepository {
  findById(
    id: number,
    select?: Partial<customSelectUser>
  ): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByHandle(handle: string): Promise<User | null>;
  findManyWithCondition(data: Partial<User>): Promise<User[]>;
  createUser(data: CreateUser): Promise<User>;
  editUser(id: number, data: EditUser): Promise<User>;
}
