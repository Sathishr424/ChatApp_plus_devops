/*
  Warnings:

  - A unique constraint covering the columns `[group_id,member_id]` on the table `groupMember` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[message_id,group_id,user_id]` on the table `group_message_seen` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "groupMember_group_id_member_id_key" ON "groupMember"("group_id", "member_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_message_seen_message_id_group_id_user_id_key" ON "group_message_seen"("message_id", "group_id", "user_id");
