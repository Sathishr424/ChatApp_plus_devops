import { Sql } from "@prisma/client/runtime/client";
import { prisma } from "../config/database/PrismaClient";
import { GroupRaw } from "../dto/common/GroupRaw";
import { RecipientRaw } from "../dto/common/RecipientRaw";
import { UserRaw } from "../dto/common/UserRaw";
import { Prisma } from "../generated/connection/client";

class ConversationRepository {
  private cursorWhere(cursor: Date, cursor_id: number, nullCheck: boolean = false) {
    if (cursor_id !== -1) {
      return Prisma.sql`
      (
        n."updatedAt" < ${cursor}
        OR (
          n."updatedAt" = ${cursor}
          AND u.id < ${cursor_id}
        )
        ${nullCheck ? Prisma.sql`OR (n."updatedAt" IS NULL AND u.id < ${cursor_id})` : Prisma.empty}
      )
    `;
    }

    if (nullCheck) {
      return Prisma.sql`
      (
        n."updatedAt" < ${cursor}
        OR n."updatedAt" IS NULL
      )
    `;
    }

    return Prisma.sql`
    n."updatedAt" < ${cursor}
  `;
  }

  private getGroupsQuery(user_id: number, where: Sql, limit: number) {
    return Prisma.sql`
    SELECT
    u.*,
      f."storedName" as avatar,
        n.count AS unread_count,
        m.message AS last_message,
        m.id AS last_message_id,
        m.deleted AS last_message_deleted,
        m.edited AS last_message_edited,
        m.gif AS last_message_gif,
        n."updatedAt" AS last_updated,
        cf.file_count as last_message_attachments
        FROM "group" as u
        LEFT JOIN "file" as f ON f.id = u.avatar_id
        LEFT JOIN not_seen_group_message n
          ON n.to_id = ${user_id}
          AND n.group_id = u.id
        LEFT JOIN "groupConversation" as m
          ON m.id = n.message_id
        LEFT JOIN LATERAL (
          SELECT COUNT(*)::int as file_count FROM "GroupConversationFile" as cf WHERE cf.message_id = m.id
        ) as cf on true
        ${where}
        AND EXISTS(
                    SELECT 1
          FROM "groupMember" AS gm
          WHERE gm.group_id = u.id
            AND gm.member_id = ${user_id}
                  )
        ORDER BY n."updatedAt" DESC NULLS LAST, u.id DESC
        LIMIT ${limit}`
  }

  private getUsersQuery(user_id: number, where: Sql, limit: number) {
    return Prisma.sql`
        SELECT
          u.*,
          f."storedName" as avatar,
          n.count AS unread_count,
          m.message AS last_message,
          m.id AS last_message_id,
          m.deleted AS last_message_deleted,
          m.edited AS last_message_edited,
          m.gif AS last_message_gif,
          n."updatedAt" AS last_updated,
          cf.file_count as last_message_attachments
        FROM users u
        LEFT JOIN "file" as f ON f.id = u.avatar_id
        LEFT JOIN not_seen_message n
          ON n.to_id = ${user_id}
          AND n.from_id = u.id
        LEFT JOIN conversation m
          ON m.id = n.message_id
        LEFT JOIN LATERAL (
          SELECT COUNT(*)::int as file_count FROM "ConversationFile" as cf WHERE cf.message_id = m.id
        ) as cf on true
        ${where}
        ORDER BY n."updatedAt" DESC NULLS LAST, u.id DESC
        LIMIT ${limit}`
  }

  async getUsers(user_id: number, cursor: Date, cursor_id: number, limit: number): Promise<UserRaw[]> {
    return await prisma.$queryRaw(
      this.getUsersQuery(user_id, Prisma.sql`WHERE ${this.cursorWhere(cursor, cursor_id)}`, limit)
    );
  }

  async getUsersWithSearch(user_id: number, search: string, cursor: Date, cursor_id: number, limit: number): Promise<UserRaw[]> {
    return await prisma.$queryRaw(
      this.getUsersQuery(user_id, Prisma.sql`WHERE u.username ILIKE ${`%${search}%`} AND ${this.cursorWhere(cursor, cursor_id, true)}`, limit)
    );
  }

  async getUsersUnread(user_id: number, cursor: Date, cursor_id: number, limit: number): Promise<UserRaw[]> {
    return await prisma.$queryRaw(
      this.getUsersQuery(user_id, Prisma.sql`WHERE n.count > 0 AND  ${this.cursorWhere(cursor, cursor_id)}`, limit)
    );
  }

  async getUsersUnreadWithSearch(user_id: number, search: string, cursor: Date, cursor_id: number, limit: number): Promise<UserRaw[]> {
    return await prisma.$queryRaw(
      this.getUsersQuery(user_id, Prisma.sql`WHERE n.count > 0 AND u.username ILIKE ${`%${search}%`} AND ${this.cursorWhere(cursor, cursor_id, false)}`, limit)
    );
  }

  async getGroups(user_id: number, cursor: Date, cursor_id: number, limit: number): Promise<GroupRaw[]> {
    return await prisma.$queryRaw(
      this.getGroupsQuery(user_id, Prisma.sql`WHERE ${this.cursorWhere(cursor, cursor_id, true)}`, limit)
    );
  }

  async getGroupsWithSearch(user_id: number, search: string, cursor: Date, cursor_id: number, limit: number): Promise<GroupRaw[]> {
    return await prisma.$queryRaw(
      this.getGroupsQuery(user_id, Prisma.sql`WHERE u.name ILIKE ${`%${search}%`} AND ${this.cursorWhere(cursor, cursor_id, true)}`, limit)
    );
  }

  async getGroupsUnread(user_id: number, cursor: Date, cursor_id: number, limit: number): Promise<GroupRaw[]> {
    return await prisma.$queryRaw(
      this.getGroupsQuery(user_id, Prisma.sql`WHERE n.count > 0 AND ${this.cursorWhere(cursor, cursor_id, true)}`, limit)
    );
  }

  async getGroupsUnreadWithSearch(user_id: number, search: string, cursor: Date, cursor_id: number, limit: number): Promise<GroupRaw[]> {
    return await prisma.$queryRaw(
      this.getGroupsQuery(user_id, Prisma.sql`WHERE n.count > 0 AND u.name ILIKE ${`%${search}%`} AND ${this.cursorWhere(cursor, cursor_id, false)}`, limit)
    );
  }

  async getUnread(user_id: number, search: string, cursor: Date, cursor_id: number, limit: number) {
    const users = search.length > 0 ? await this.getUsersUnreadWithSearch(user_id, search, cursor, cursor_id, limit) : await this.getUsersUnread(user_id, cursor, cursor_id, limit);
    const groups = search.length > 0 ? await this.getGroupsUnreadWithSearch(user_id, search, cursor, cursor_id, limit) : await this.getGroupsUnread(user_id, cursor, cursor_id, limit);

    const merged: RecipientRaw[] = [...users, ...groups];
    merged.sort((a, b) => {
      if (a.last_updated === null && b.last_updated === null) return 0;
      if (a.last_updated === null) return 1;
      if (b.last_updated === null) return -1;

      if (a.last_updated > b.last_updated) return -1;
      if (a.last_updated < b.last_updated) return 1;

      return 0;
    });

    merged.splice(limit);
    return merged;
  }

  async getRecent(user_id: number, search: string, cursor: Date, cursor_id: number, limit: number) {
    const users = search.length > 0 ? await this.getUsersWithSearch(user_id, search, cursor, cursor_id, limit) : await this.getUsers(user_id, cursor, cursor_id, limit);
    const groups = search.length > 0 ? await this.getGroupsWithSearch(user_id, search, cursor, cursor_id, limit) : await this.getGroups(user_id, cursor, cursor_id, limit);

    const merged: RecipientRaw[] = [...users, ...groups];
    merged.sort((a, b) => {
      if (a.last_updated === null && b.last_updated === null) return 0;
      if (a.last_updated === null) return 1;
      if (b.last_updated === null) return -1;

      if (a.last_updated > b.last_updated) return -1;
      if (a.last_updated < b.last_updated) return 1;

      return 0;
    });

    merged.splice(limit);
    return merged;
  }
}

export default new ConversationRepository();
