/*
  Warnings:

  - Added the required column `admin` to the `groupMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "groupMember" ADD COLUMN     "admin" BOOLEAN NOT NULL;
