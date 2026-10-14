/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `file_id` on the `File` table. All the data in the column will be lost.
  - Added the required column `storedName` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ConversationFile" DROP CONSTRAINT "ConversationFile_file_id_fkey";

-- DropForeignKey
ALTER TABLE "GroupConversationFile" DROP CONSTRAINT "GroupConversationFile_file_id_fkey";

-- DropIndex
DROP INDEX "File_file_id_key";

-- AlterTable
ALTER TABLE "File" DROP CONSTRAINT "File_pkey",
DROP COLUMN "file_id",
ADD COLUMN     "storedName" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "File_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "File_id_seq";

-- AddForeignKey
ALTER TABLE "ConversationFile" ADD CONSTRAINT "ConversationFile_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupConversationFile" ADD CONSTRAINT "GroupConversationFile_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
