-- DropForeignKey
ALTER TABLE "groupConversation" DROP CONSTRAINT "groupConversation_reply_id_fkey";

-- AlterTable
ALTER TABLE "groupConversation" ALTER COLUMN "reply_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "groupConversation" ADD CONSTRAINT "groupConversation_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "groupConversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
