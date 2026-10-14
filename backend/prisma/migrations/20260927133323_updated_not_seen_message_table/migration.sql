/*
  Warnings:

  - You are about to drop the column `conversationId` on the `not_seen_group_message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "not_seen_group_message" DROP CONSTRAINT "not_seen_group_message_conversationId_fkey";

-- AlterTable
ALTER TABLE "not_seen_group_message" DROP COLUMN "conversationId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
