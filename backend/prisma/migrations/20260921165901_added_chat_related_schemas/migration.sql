-- CreateTable
CREATE TABLE "conversation" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "reply_id" INTEGER,
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupMember" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupMessage" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "from_id" INTEGER NOT NULL,
    "reply_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groupMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupMember" ADD CONSTRAINT "groupMember_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupMember" ADD CONSTRAINT "groupMember_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupMessage" ADD CONSTRAINT "groupMessage_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupMessage" ADD CONSTRAINT "groupMessage_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "groupMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupMessage" ADD CONSTRAINT "groupMessage_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
