import DTORequest from "../../interfaces/DTORequest";
import { Message } from "../../models/Message";
import { FileResponseDTO } from "./FileResponseDTO";
import { UserResponseDTO } from "./UserResponseDTO";

export class MessageResponseDTO implements DTORequest {
  public id!: number;
  public is_group = false;
  public from_id!: number;
  public to_id!: number;
  public deleted!: boolean;
  public edited!: boolean;
  public seen!: boolean;
  public gif!: string;
  public reply_id?: number | null;
  public from?: UserResponseDTO;
  public to?: UserResponseDTO;
  public reply?: MessageResponseDTO | null;
  public message!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public files!: FileResponseDTO[];

  public static fromMessage(message: Message): MessageResponseDTO {
    const dto = new MessageResponseDTO();

    dto.id = message.id;
    dto.from_id = message.from_id;
    dto.to_id = message.to_id;
    dto.reply_id = message.reply_id;
    dto.deleted = message.deleted;
    dto.edited = message.edited;
    dto.gif = message.gif;
    dto.message = message.message;
    dto.createdAt = message.createdAt;
    dto.updatedAt = message.updatedAt;
    dto.seen = message.seen;
    if (message.from) dto.from = UserResponseDTO.fromUser(message.from);
    if (message.to) dto.to = UserResponseDTO.fromUser(message.to);
    if (message.reply) dto.reply = MessageResponseDTO.fromMessage(message.reply);

    if (message.files) {
      dto.files = message.files.map(file => {
        return file.file
      });
    }

    return dto;
  }
}
