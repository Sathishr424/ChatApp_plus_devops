import { Prisma } from "@prisma/client/extension";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../config/database/PrismaClient";
import { NoMessageFound } from "../exceptions/NoMessageFound";
import { NotAuthorised } from "../exceptions/NotAuthorised";
import { EditMessage, MessageFilter, SentFile, SentGroupMessage } from "../interfaces";
import { GroupMessage } from "../models/GroupMessage";
import FileRepository from "./FileRepository";

class GroupChatRepository {
  async isUserInTheGroup(user_id: number, group_id: number) {
    const count = await prisma.groupMember.count({
      where: {
        group_id: group_id,
        member_id: user_id
      }
    });
    return count !== 0;
  }

  async getMessagesSearchResults(filter: MessageFilter, offset: number, limit: number) {
    const message_ids: { id: number }[] = await prisma.groupConversation.findMany({
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
    const messages: { id: number }[] = await prisma.groupConversation.findMany({
      where: filter,
      skip: offset,
      select: {
        id: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 1
    });
    return messages;
  }

  async getMessages(filter: MessageFilter, offset: number, limit: number) {
    const messages: GroupMessage[] = await prisma.groupConversation.findMany({
      where: filter,
      include: {
        from: true,
        files: {
          include: {
            file: true
          }
        },
        reply: {
          include: {
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

    return await prisma.groupConversation.update({
      where: {
        id: data.message_id
      },
      data: {
        message: data.message,
        edited: true
      },
      include: {
        from: true,
        group: true,
        files: {
          include: {
            file: true
          }
        },
        reply: {
          include: {
            from: true,
            group: true,
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

  async sentMessage(data: SentGroupMessage, files: SentFile[]) {
    return await prisma.$transaction(async (tx) => {
      const message: GroupMessage = await tx.groupConversation.create({
        data,
        include: {
          from: true,
          group: true,
          reply: {
            include: {
              group: true,
              from: true,
              files: {
                include: {
                  file: true
                }
              }
            },
          },
          notSeenGroupMessages: {
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

      const messageFiles = await tx.groupConversationFile.createManyAndReturn({
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
      } as GroupMessage;
    });
  }

  private async getOwner(message_id: number) {
    const message: GroupMessage | null = await prisma.groupConversation.findUnique({
      where: {
        id: message_id
      }
    });

    if (message === null) throw new NoMessageFound();
    return message.from_id;
  }

  async deleteMessages(filter: MessageFilter) {
    await prisma.groupConversation.deleteMany({
      where: filter
    });
    return true;
  }

  async deleteMessage(user_id: number, message_id: number) {
    const owner = await this.getOwner(message_id);
    if (owner !== user_id) throw new NotAuthorised();

    await prisma.groupConversation.updateMany({
      where: {
        id: message_id
      },
      data: {
        deleted: true
      }
    });

    return true;
  }

  async markSeen(user_id: number, group_id: number) {
    try {
      // TODO: Add invidual message seen feature

      await prisma.not_seen_group_message.updateMany({
        where: {
          group_id: group_id,
          to_id: user_id,
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

  async fetchGroupMembers(tx: Prisma.TransactionClient, group_id: number, user_id: number): Promise<{member_id: number}[]> {
    return await tx.groupMember.findMany({
      where: {
        group_id: group_id,
        member_id: {
          not: user_id,
        },
      },
      select: {
        member_id: true,
      },
    });
  }

  private async updateNotSeen(tx: Prisma.TransactionClient, message: GroupMessage) {
    const members = await this.fetchGroupMembers(tx, message.group_id, message.from_id);

    await Promise.all(
      members.map(({ member_id }) =>
        tx.not_seen_group_message.upsert({
          where: {
            group_id_to_id: {
              group_id: message.group_id,
              to_id: member_id,
            },
          },
          create: {
            group_id: message.group_id,
            to_id: member_id,
            count: 1,
            message_id: message.id,
          },
          update: {
            count: {
              increment: 1,
            },
            message_id: message.id,
          },
        })
      )
    );

    // This is for just updating the last message so that when we fetch this on the user the last message will be updated
    await tx.not_seen_group_message.upsert({
      where: {
        group_id_to_id: {
          to_id: message.from_id,
          group_id: message.group_id,
        },
      },
      update: {
        message_id: message.id,
      },
      create: {
        to_id: message.from_id,
        group_id: message.group_id,
        message_id: message.id,
        count: 0,
      },
    });
  }
}

export default new GroupChatRepository();
