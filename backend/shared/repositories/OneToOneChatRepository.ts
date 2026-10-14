import { Prisma } from "@prisma/client/extension";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../config/database/PrismaClient";
import { NoMessageFound } from "../exceptions/NoMessageFound";
import { NotAuthorised } from "../exceptions/NotAuthorised";
import { EditMessage, MessageFilter, SentFile, SentMessage } from "../interfaces";
import { Message } from "../models/Message";
import FileRepository from "./FileRepository";

class OneToOneChatRepository {
  async getMessagesSearchResults(filter: MessageFilter, offset: number, limit: number) {
    const message_ids: { id: number }[] = await prisma.conversation.findMany({
      where: filter,
      select: {
        id: true
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });
    return message_ids.map(msg => msg.id);
  }

  async loadMessagesUntilMessageId(filter: MessageFilter, message_id: number, offset: number, limit: number) {
    let left = offset
    let step = 1;
    let right = left + step;
    let res = await this.fetchMessage(filter, right);
    if (res.length === 0) return offset;
    while (res.length > 0 && res[0].id > message_id) {
      left = right
      step *= 2
      right = offset + step;
      res = await this.fetchMessage(filter, right);
    }

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      const msg = await this.fetchMessage(filter, mid);

      if (msg.length == 0 || msg[0].id <= message_id) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    return left + limit;
  }

  private async fetchMessage(filter: MessageFilter, offset: number) {
    const messages: { id: number }[] = await prisma.conversation.findMany({
      where: filter,
      skip: offset,
      select: {
        id: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 1
    });
    return messages;
  }

  async getMessages(filter: MessageFilter, offset: number, limit: number) {
    const messages: Message[] = await prisma.conversation.findMany({
      where: filter,
      include: {
        to: true,
        from: true,
        files: {
          include: {
            file: true
          }
        },
        reply: {
          include: {
            to: true,
            from: true,
            files: {
              include: {
                file: true
              }
            }
          }
        }
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });
    return messages;
  }

  async editMessage(user_id: number, data: EditMessage) {
    const owner = await this.getOwner(data.message_id);
    if (owner !== user_id) throw new NotAuthorised();

    return await prisma.conversation.update({
      where: {
        id: data.message_id
      },
      data: {
        message: data.message,
        edited: true
      },
      include: {
        from: true,
        to: true,
        files: {
          include: {
            file: true
          }
        },
        reply: {
          include: {
            from: true,
            to: true,
            files: {
              include: {
                file: true
              }
            }
          }
        }
      }
    });

  }

  async sentMessage(data: SentMessage, files: SentFile[]) {
    return await prisma.$transaction(async (tx) => {
      const message: Message = await tx.conversation.create({
        data,
        include: {
          to: true,
          from: true,
          files: {
            include: {
              file: true
            }
          },
          reply: {
            include: {
              to: true,
              from: true,
              files: {
                include: {
                  file: true
                }
              }
            },
          },
          notSeenMessages: {
            where: {
              to_id: data.from_id,
            },
            include: {
              message: true,
            },
          },
        },
      });

      await this.updateNotSeen(tx, message);

      const createdFiles = files.length > 0 ? await FileRepository.createFiles(
        tx,
        files
      ) : [];

      const messageFiles = await tx.conversationFile.createManyAndReturn({
        data: createdFiles.map(file => {
          return {
            message_id: message.id,
            file_id: file.id
          }
        }),
        include: {
          file: true
        }
      });

      return {
        ...message,
        files: messageFiles,
      } as Message;
    });
  }

  private async getOwner(message_id: number) {
    const message: Message | null = await prisma.conversation.findUnique({
      where: {
        id: message_id
      }
    });

    if (message === null) throw new NoMessageFound();
    return message.from_id;
  }

  async deleteMessages(filter: MessageFilter) {
    await prisma.conversation.deleteMany({
      where: filter
    });
    return true;
  }

  async deleteMessage(user_id: number, message_id: number) {
    const owner = await this.getOwner(message_id);
    if (owner !== user_id) throw new NotAuthorised();

    await prisma.conversation.update({
      where: {
        id: message_id
      },
      data: {
        deleted: true
      }
    });

    return true;
  }

  async markSeen(user_id: number, from_id: number) {
    try {
      await prisma.conversation.updateMany({
        where: {
          from_id: from_id,
          to_id: user_id,
        },
        data: {
          seen: true
        }
      });

      await prisma.not_seen_message.update({
        where: {
          from_id_to_id: {
            from_id: from_id,
            to_id: user_id,
          },
          count: {
            gt: 0,
          }
        },
        data: {
          count: 0
        }
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        // Record doesn't exist — nothing to mark as seen
        return;
      }

      throw error;
    }
    return true;
  }

  private async updateNotSeen(tx: Prisma.TransactionClient, message: Message) {
    await tx.not_seen_message.upsert({
      where: {
        from_id_to_id: {
          from_id: message.from_id,
          to_id: message.to_id,
        },
      },
      update: {
        count: {
          increment: 1,
        },
        message_id: message.id,
      },
      create: {
        from_id: message.from_id,
        to_id: message.to_id,
        message_id: message.id,
        count: 1,
      },
    });

    // This is for just updating the last message so that when we fetch this on the user the last message will be updated
    await tx.not_seen_message.upsert({
      where: {
        from_id_to_id: {
          from_id: message.to_id,
          to_id: message.from_id,
        },
      },
      update: {
        message_id: message.id,
      },
      create: {
        from_id: message.to_id,
        to_id: message.from_id,
        message_id: message.id,
        count: 0,
      },
    });

  }
}

export default new OneToOneChatRepository();
