/*
  Warnings:

  - You are about to drop the column `otpCode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpires` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "otpCode",
DROP COLUMN "otpExpires";
