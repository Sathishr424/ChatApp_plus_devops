import { prisma } from "../config/database/PrismaClient";
import { UserRaw } from "../dto/common/UserRaw";
import { UsersUpdateDTO } from "../dto/request/UserUpdateDTO";
import { UserNotExists } from "../exceptions/UserNotExists";
import { User } from "../models/User";
import FileRepository from "./FileRepository";
import ConversationRepository from "./ConversationRepository";

class UserRepository {
  async getUser(userId: number) {
    const user: User | null = await prisma.users.findFirst({
      where: {
        id: userId
      },
      include: {
        avatar: true,
        notSeenMessagesSent: {
          where: {
            to_id: userId,
          },
          include: {
            message: true
          }
        }
      }
    })

    if (user === null) throw new UserNotExists();
    return user;
  }

  async updateUser(user_id: number, data: UsersUpdateDTO): Promise<User> {
    return await prisma.$transaction(async (tx) => {
      const createdFile = data.avatarFile ? await FileRepository.createFiles(tx, [data.avatarFile]) : [];

      return await tx.users.update({
        where: {
          id: user_id,
        },
        include: {
          avatar: true,
          notSeenMessagesSent: {
            where: {
              to_id: user_id,
            },
            include: {
              message: true
            }
          }
        },
        data: {
          fullname: data.fullname,
          ...(createdFile.length > 0 ? { avatar_id: createdFile[0].id } : {})
        }
      });
    });
  }

  async getUsersRaw(user_id: number, cursor: Date, cursor_id: number, limit: number): Promise<UserRaw[]> {
    return await ConversationRepository.getUsers(user_id, cursor, cursor_id, limit);
  }

  async updateLastSeen(userId: number) {
    await prisma.users.updateMany({
      where: {
        id: userId
      },
      data: {
        lastSeen: new Date()
      }
    });
    return true;
  }

  async getUsers(user_id: number, search: string, offset: number, limit: number) {
    // TODO: Later only search users that the current user have in their friends/contacts list
    return await prisma.users.findMany({
      where: {
        ...(search && {
          username: {
            contains: search,
            mode: "insensitive"
          }
        }),
        id: {
          not: user_id
        },
      },
      include: {
        avatar: true,
        notSeenMessagesSent: {
          where: {
            to_id: user_id
          },
          include: {
            message: true
          }
        }
      },
      skip: offset,
      take: limit
    });
  }
}

export default new UserRepository();
