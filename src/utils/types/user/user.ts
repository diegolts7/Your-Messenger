export type CreateUser = {
  name: string;
  handle: string;
  email: string;
};

export type EditUser = CreateUser & {
  optCode: string;
  otpExpires: Date;
};
