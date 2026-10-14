/*
  Warnings:

  - Made the column `message_id` on table `not_seen_group_message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `message_id` on table `not_seen_message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "not_seen_group_message" DROP CONSTRAINT "not_seen_group_message_message_id_fkey";

-- DropForeignKey
ALTER TABLE "not_seen_message" DROP CONSTRAINT "not_seen_message_message_id_fkey";

-- AlterTable
ALTER TABLE "not_seen_group_message" ALTER COLUMN "message_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "not_seen_message" ALTER COLUMN "message_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "not_seen_message" ADD CONSTRAINT "not_seen_message_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "not_seen_group_message" ADD CONSTRAINT "not_seen_group_message_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "groupConversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
