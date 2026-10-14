-- CreateTable
CREATE TABLE "ConversationFile" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "ConversationFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupConversationFile" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "GroupConversationFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "storedName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConversationFile_file_id_key" ON "ConversationFile"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupConversationFile_file_id_key" ON "GroupConversationFile"("file_id");

-- AddForeignKey
ALTER TABLE "ConversationFile" ADD CONSTRAINT "ConversationFile_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationFile" ADD CONSTRAINT "ConversationFile_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupConversationFile" ADD CONSTRAINT "GroupConversationFile_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "groupConversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupConversationFile" ADD CONSTRAINT "GroupConversationFile_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
