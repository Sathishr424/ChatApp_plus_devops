import DTORequest from "../../interfaces/DTORequest";
import { GroupMessage } from "../../models/GroupMessage";
import { FileResponseDTO } from "./FileResponseDTO";
import { GroupResponseDTO } from "./GroupResponseDTO";
import { UserResponseDTO } from "./UserResponseDTO";

export class GroupMessageResponseDTO implements DTORequest {
  public id!: number;
  public is_group = true;
  public from_id!: number;
  public group_id!: number;
  // TODO: Implement last seen on every group member
  public seen: boolean = false;
  public deleted!: boolean;
  public edited!: boolean;
  public gif!: string;
  public reply_id?: number | null;
  public from?: UserResponseDTO;
  public group?: GroupResponseDTO
  public reply?: GroupMessageResponseDTO | null;
  public message!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public files!: FileResponseDTO[];

  public static fromGroupMessage(message: GroupMessage): GroupMessageResponseDTO {
    const dto = new GroupMessageResponseDTO();

    dto.id = message.id;
    dto.from_id = message.from_id;
    dto.group_id = message.group_id;
    dto.reply_id = message.reply_id;
    dto.deleted = message.deleted;
    dto.edited = message.edited;
    dto.gif = message.gif;
    dto.message = message.message;
    dto.createdAt = message.createdAt;
    dto.updatedAt = message.updatedAt;
    if (message.from) dto.from = UserResponseDTO.fromUser(message.from);
    if (message.group) dto.group = GroupResponseDTO.fromGroup(message.group);
    if (message.reply) dto.reply = GroupMessageResponseDTO.fromGroupMessage(message.reply);

    if (message.files) {
      dto.files = message.files.map(file => {
        return file.file
      });
    }

    return dto;
  }
}
