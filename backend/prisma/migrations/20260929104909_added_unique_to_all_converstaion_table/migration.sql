/*
  Warnings:

  - A unique constraint covering the columns `[from_id,to_id]` on the table `conversation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[from_id,group_id]` on the table `groupConversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "conversation_from_id_to_id_key" ON "conversation"("from_id", "to_id");

-- CreateIndex
CREATE UNIQUE INDEX "groupConversation_from_id_group_id_key" ON "groupConversation"("from_id", "group_id");
