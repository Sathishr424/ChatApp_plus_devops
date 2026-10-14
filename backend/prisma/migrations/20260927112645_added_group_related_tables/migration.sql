/*
  Warnings:

  - You are about to drop the `groupMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "groupMessage" DROP CONSTRAINT "groupMessage_from_id_fkey";

-- DropForeignKey
ALTER TABLE "groupMessage" DROP CONSTRAINT "groupMessage_group_id_fkey";

-- DropForeignKey
ALTER TABLE "groupMessage" DROP CONSTRAINT "groupMessage_reply_id_fkey";

-- DropTable
DROP TABLE "groupMessage";

-- CreateTable
CREATE TABLE "not_seen_group_message" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "message_id" INTEGER,
    "conversationId" INTEGER,

    CONSTRAINT "not_seen_group_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_message_seen" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "group_message_seen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupConversation" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "reply_id" INTEGER NOT NULL,
    "from_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groupConversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "not_seen_group_message_group_id_to_id_key" ON "not_seen_group_message"("group_id", "to_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_message_seen_message_id_user_id_key" ON "group_message_seen"("message_id", "user_id");

-- AddForeignKey
ALTER TABLE "not_seen_group_message" ADD CONSTRAINT "not_seen_group_message_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "not_seen_group_message" ADD CONSTRAINT "not_seen_group_message_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "not_seen_group_message" ADD CONSTRAINT "not_seen_group_message_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "groupConversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "not_seen_group_message" ADD CONSTRAINT "not_seen_group_message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_message_seen" ADD CONSTRAINT "group_message_seen_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "groupConversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_message_seen" ADD CONSTRAINT "group_message_seen_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupConversation" ADD CONSTRAINT "groupConversation_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupConversation" ADD CONSTRAINT "groupConversation_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupConversation" ADD CONSTRAINT "groupConversation_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "groupConversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
