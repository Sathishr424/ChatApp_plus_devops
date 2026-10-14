import { User } from "../../models/User";
import { UserRaw } from "../common/UserRaw";

export class UserResponseDTO {
  id!: number;
  email!: string;
  username!: string | null;
  fullname!: string | null;
  last_seen!: Date;
  is_group = false;
  unread_count = 0;
  last_message!: string | null;
  last_message_id!: number | null;
  last_message_deleted!: boolean | null;
  last_message_edited!: boolean | null;
  last_message_gif!: string | null;
  last_updated!: Date | null;
  last_message_attachments: number = 0;
  avatar!: String | null;
  createdAt!: Date;

  public static fromUserRaw(user: UserRaw): UserResponseDTO {
    const dto = new UserResponseDTO();
    dto.id = user.id;
    dto.username = user.username;
    dto.fullname = user.fullname;
    dto.email = user.email;
    dto.last_seen = user.lastSeen;
    if (user.unread_count !== null) dto.unread_count = user.unread_count;
    dto.avatar = user.avatar;
    dto.last_message = user.last_message;
    dto.last_message_id = user.last_message_id;
    dto.last_message_deleted = user.last_message_deleted;
    dto.last_message_edited = user.last_message_edited;
    dto.last_updated = user.last_updated;
    dto.createdAt = user.createdAt;
    if (user.last_message_attachments) dto.last_message_attachments = user.last_message_attachments;
    if (user.last_message_gif) dto.last_message_gif = user.last_message_gif;
    return dto;
  }

  public static fromUser(user: User): UserResponseDTO {
    const dto = new UserResponseDTO();
    dto.id = user.id;
    dto.username = user.username;
    dto.email = user.email;
    dto.last_seen = user.lastSeen;
    dto.fullname = user.fullname;
    dto.avatar = user.avatar?.storedName ?? null;
    dto.createdAt = user.createdAt;

    if (user.notSeenMessagesSent && user.notSeenMessagesSent.length > 0 && user.notSeenMessagesSent[0].message) {
      const msg = user.notSeenMessagesSent[0];
      dto.unread_count = msg.count;
      dto.last_message = msg.message!.message;

      dto.last_message_id = msg.message_id;
      dto.last_message_deleted = msg.message!.deleted;
      dto.last_message_edited = msg.message!.edited;
      dto.last_updated = msg.message!.updatedAt;
    }
    return dto;
  }
}
