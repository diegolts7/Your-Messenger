import { User } from "@prisma/client";

export type CreateUser = {
  name: string;
  handle: string;
  email: string;
};

export type EditUser = CreateUser & {
  optCode: string;
  otpExpires: Date;
};

export type customSelectUser = {
  [K in keyof User]: boolean;
};
