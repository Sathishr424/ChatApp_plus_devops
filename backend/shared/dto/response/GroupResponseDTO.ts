import { Group } from "../../models/Group";
import { GroupRaw } from "../common/GroupRaw";
import { UserResponseDTO } from "./UserResponseDTO";

export class GroupResponseDTO {
  id!: number;
  name!: string;
  is_group = true;
  unread_count = 0;
  last_message!: String | null;
  last_message_id!: number | null;
  last_message_deleted!: boolean | null;
  last_message_edited!: boolean | null;
  last_message_gif!: string | null;
  last_updated!: Date | null;
  members!: UserResponseDTO[];
  members_count!: number;
  avatar!: String | null;
  last_message_attachments: number = 0;
  createdAt!: Date;

  public static fromGroupRaw(group: GroupRaw): GroupResponseDTO {
    const dto = new GroupResponseDTO();
    dto.id = group.id;
    dto.name = group.name;
    if (group.unread_count !== null) dto.unread_count = group.unread_count;
    dto.last_message = group.last_message;

    dto.avatar = group.avatar;
    dto.last_message_id = group.last_message_id;
    dto.last_message_deleted = group.last_message_deleted;
    dto.last_message_edited = group.last_message_edited;
    dto.last_updated = group.last_updated;
    dto.createdAt = group.createdAt;
    dto.members_count = group.members_count;
    if (group.last_message_attachments) dto.last_message_attachments = group.last_message_attachments;
    if (group.last_message_gif) dto.last_message_gif = group.last_message_gif;
    return dto;
  }

  public static fromGroup(group: Group): GroupResponseDTO {
    const dto = new GroupResponseDTO();
    dto.id = group.id;
    dto.name = group.name;
    dto.members_count = group.members_count;
    if (group.notSeenGroupMessages && group.notSeenGroupMessages.length > 0 && group.notSeenGroupMessages[0].message) {
      const msg = group.notSeenGroupMessages[0];
      dto.unread_count = msg.count;
      dto.last_message = msg.message!.message;

      dto.last_message_id = msg.message_id;
      dto.last_message_deleted = msg.message!.deleted;
      dto.last_message_edited = msg.message!.edited;
      dto.last_updated = msg.message!.updatedAt;
    }
    dto.avatar = group.avatar?.storedName ?? null;
    dto.createdAt = group.createdAt;
    dto.members = group.members?.map((member): UserResponseDTO => {
      return UserResponseDTO.fromUser(member.member!);
    }) ?? [];
    return dto;
  }
}
