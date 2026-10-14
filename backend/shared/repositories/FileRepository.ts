import { Prisma } from "@prisma/client/extension";
import { SentFile } from "../interfaces";
import { MessageFile } from "../models/MessageFile";

class FileRepository {
  async createFiles(tx: Prisma.TransactionClient, files: SentFile[]): Promise<{ id: string }[]> {
    return await tx.file.createManyAndReturn({
      data: files,
      select: {
        id: true
      }
    });
  }
}

export default new FileRepository();
