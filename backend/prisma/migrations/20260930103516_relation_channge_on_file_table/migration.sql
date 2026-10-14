/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `storedName` on the `File` table. All the data in the column will be lost.
  - The `id` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[file_id]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_id` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ConversationFile" DROP CONSTRAINT "ConversationFile_file_id_fkey";

-- DropForeignKey
ALTER TABLE "GroupConversationFile" DROP CONSTRAINT "GroupConversationFile_file_id_fkey";

-- AlterTable
ALTER TABLE "File" DROP CONSTRAINT "File_pkey",
DROP COLUMN "storedName",
ADD COLUMN     "file_id" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "File_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "File_file_id_key" ON "File"("file_id");

-- AddForeignKey
ALTER TABLE "ConversationFile" ADD CONSTRAINT "ConversationFile_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "File"("file_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupConversationFile" ADD CONSTRAINT "GroupConversationFile_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "File"("file_id") ON DELETE RESTRICT ON UPDATE CASCADE;
