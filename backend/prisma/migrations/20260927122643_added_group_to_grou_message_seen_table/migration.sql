/*
  Warnings:

  - Added the required column `group_id` to the `group_message_seen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "group_message_seen" ADD COLUMN     "group_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "group_message_seen" ADD CONSTRAINT "group_message_seen_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
