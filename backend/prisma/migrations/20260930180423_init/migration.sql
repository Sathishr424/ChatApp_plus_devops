/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConversationFile" DROP CONSTRAINT "ConversationFile_file_id_fkey";

-- DropForeignKey
ALTER TABLE "GroupConversationFile" DROP CONSTRAINT "GroupConversationFile_file_id_fkey";

-- DropForeignKey
ALTER TABLE "group" DROP CONSTRAINT "group_avatar_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_fkey";

-- DropTable
DROP TABLE "File";

-- CreateTable
CREATE TABLE "file" (
    "id" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "storedName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationFile" ADD CONSTRAINT "ConversationFile_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupConversationFile" ADD CONSTRAINT "GroupConversationFile_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
