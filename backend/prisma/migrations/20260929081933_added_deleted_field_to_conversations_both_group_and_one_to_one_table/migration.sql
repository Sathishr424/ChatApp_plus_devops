-- AlterTable
ALTER TABLE "conversation" ADD COLUMN     "edited" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "groupConversation" ADD COLUMN     "edited" BOOLEAN NOT NULL DEFAULT false;
