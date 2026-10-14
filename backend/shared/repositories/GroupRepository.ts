import { prisma } from "../config/database/PrismaClient";
import { GroupRaw } from "../dto/common/GroupRaw";
import { GroupRequestDTO } from "../dto/request/GroupRequestDTO";
import { GroupNotExists } from "../exceptions/GroupNotExists";
import { NotAuthorised } from "../exceptions/NotAuthorised";
import { Group } from "../models/Group";
import FileRepository from "./FileRepository";
import ConversationRepository from "./ConversationRepository";

class GroupRepository {
  async createGroup(user_id: number, groupDTO: GroupRequestDTO) {
    const group = await prisma.$transaction(async (tx) => {
      const createdFile = groupDTO.avatarFile ? await FileRepository.createFiles(tx, [groupDTO.avatarFile]) : [];

      const group: Group = await tx.group.create({
        data: {
          name: groupDTO.name,
          members_count: groupDTO.members.length,
          ...(createdFile.length > 0 ? { avatar_id: createdFile[0].id } : {})
        },
        include: {
          members: true,
          notSeenGroupMessages: {
            include: {
              message: true
            },
            where: {
              to_id: user_id
            }
          }
        }
      });

      await tx.groupMember.createMany({
        data: [
          ...groupDTO.members.map(id => ({
            group_id: group.id,
            member_id: id,
          })),
          {
            group_id: group.id,
            member_id: user_id,
            admin: true
          }
        ]
      });

      return group;
    })

    return await this.getGroup(user_id, group.id);
  }

  async getGroup(user_id: number, group_id: number): Promise<Group> {
    const group = await prisma.group.findFirst({
      where: {
        id: group_id,
        members: {
          some: {
            member_id: user_id
          }
        }
      },
      include: {
        avatar: true,
        members: {
          include: {
            member: {
              include: {
                avatar: true
              }
            }
          }
        },
        notSeenGroupMessages: {
          include: {
            message: true
          },
          where: {
            to_id: user_id
          }
        }
      }
    });
    if (group === null) throw new GroupNotExists();
    return group;
  }

  async getGroupMemberIds(user_id: number, group_id: number) {
    const exist = await prisma.groupMember.count({
      where: {
        group_id: group_id,
        member_id: user_id
      }
    });
    if (!exist) throw new NotAuthorised();

    const member_ids: { member_id: number }[] = await prisma.groupMember.findMany({
      where: {
        group_id: group_id,
      },
      select: {
        member_id: true
      }
    });

    return member_ids.map(m => m.member_id);
  }

  async getGroupsRaw(user_id: number, cursor: Date, cursor_id: number, limit: number): Promise<GroupRaw[]> {
    return await ConversationRepository.getGroups(user_id, cursor, cursor_id, limit);
  }

  async getGroupIds(user_id: number): Promise<{ id: number }[]> {
    return await prisma.group.findMany({
      where: {
        members: {
          some: {
            member_id: user_id
          }
        }
      },
      select: {
        id: true
      }
    });
  }

  async getGroups(user_id: number, offset: number, limit: number): Promise<Group[]> {
    const groups: Group[] = await prisma.group.findMany({
      where: {
        members: {
          some: {
            member_id: user_id
          }
        }
      },
      include: {
        avatar: true,
        members: {
          include: {
            member: {
              include: {
                avatar: true
              }
            }
          }
        },
        notSeenGroupMessages: {
          include: {
            message: true
          },
          where: {
            to_id: user_id
          }
        }
      },
      skip: offset,
      take: limit,
    });
    return groups;
  }

  async deleteGroup(user_id: number, group_id: number) {
    const group = await prisma.group.findFirst({
      where: {
        id: group_id,
        members: {
          some: {
            member_id: user_id,
            admin: true
          },
        },
      },
    });

    if (!group) {
      throw new NotAuthorised();
    }

    await prisma.group.delete({
      where: {
        id: group_id,
      },
    });
    return true;
  }

  async UpdateGroup(user_id: number, group_id: number, groupDTO: GroupRequestDTO): Promise<Group> {
    const group = await prisma.group.findFirst({
      where: {
        id: group_id,
        members: {
          some: {
            member_id: user_id,
            admin: true
          },
        },
      },
      include: {
        members: true
      }
    });

    if (!group) {
      throw new NotAuthorised();
    }

    return await prisma.$transaction(async (tx) => {
      const createdFile = groupDTO.avatarFile ? await FileRepository.createFiles(tx, [groupDTO.avatarFile]) : [];

      // 1. Remove members not in the new list
      await tx.groupMember.deleteMany({
        where: {
          group_id,
          member_id: {
            notIn: groupDTO.members,
          },
        },
      });

      // 2. Add members that don't exist
      await tx.groupMember.createMany({
        data: groupDTO.members.map(member_id => ({
          group_id,
          member_id,
        })),
        skipDuplicates: true,
      });

      return await tx.group.update({
        where: {
          id: group_id
        },
        data: {
          name: groupDTO.name,
          members_count: groupDTO.members.length,
          ...(createdFile.length > 0 ? { avatar_id: createdFile[0].id } : {})
        },
        include: {
          avatar: true,
          members: {
            include: {
              member: {
                include: {
                  avatar: true
                }
              }
            }
          },
          notSeenGroupMessages: {
            include: {
              message: true
            },
            where: {
              to_id: user_id
            }
          }
        }
      })
    })
  }
}

export default new GroupRepository();
