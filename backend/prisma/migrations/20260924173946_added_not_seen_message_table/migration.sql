-- AlterTable
ALTER TABLE "conversation" ADD COLUMN     "seen" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "not_seen_message" (
    "id" SERIAL NOT NULL,
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,
    "message_id" INTEGER,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "not_seen_message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "not_seen_message" ADD CONSTRAINT "not_seen_message_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "not_seen_message" ADD CONSTRAINT "not_seen_message_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "not_seen_message" ADD CONSTRAINT "not_seen_message_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
