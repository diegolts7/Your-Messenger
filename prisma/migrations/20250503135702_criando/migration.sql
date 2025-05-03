-- CreateTable
CREATE TABLE "message_attempt" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "retries" INTEGER NOT NULL DEFAULT 0,
    "lastTried" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_attempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "message_attempt_messageId_key" ON "message_attempt"("messageId");

-- AddForeignKey
ALTER TABLE "message_attempt" ADD CONSTRAINT "message_attempt_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
