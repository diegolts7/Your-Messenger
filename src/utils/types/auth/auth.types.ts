export type DecodedToken = {
  userId: number;
  iat: number;
  exp: number;
};

export type PayloadToken = Pick<DecodedToken, "userId">;
