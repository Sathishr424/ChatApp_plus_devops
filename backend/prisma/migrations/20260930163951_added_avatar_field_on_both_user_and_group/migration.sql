/*
  Warnings:

  - A unique constraint covering the columns `[avatar_id]` on the table `group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatar_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "group" ADD COLUMN     "avatar_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_id" TEXT,
ADD COLUMN     "fullname" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "group_avatar_id_key" ON "group"("avatar_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_avatar_id_key" ON "users"("avatar_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
