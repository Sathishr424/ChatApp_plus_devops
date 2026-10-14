/*
  Warnings:

  - A unique constraint covering the columns `[from_id,to_id]` on the table `not_seen_message` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "not_seen_message_from_id_to_id_key" ON "not_seen_message"("from_id", "to_id");
