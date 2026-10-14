import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import DTORequest from "../../interfaces/DTORequest";

export class FileRequestDTO {
  @IsString()
  @IsNotEmpty()
  public originalName!: string;

  @IsString()
  @IsNotEmpty()
  public storedName!: string;

  @IsNumber()
  public size!: number;

  @IsString()
  @IsNotEmpty()
  public mimeType!: string;
}

export class MessageRequestDTO implements DTORequest {
  @IsNotEmpty({ message: "message is required." })
  public message!: string;

  @IsOptional()
  @IsNumber({}, { message: "reply_id should be number" })
  public reply_id!: number;

  @IsOptional()
  @IsString({ message: "gif should be string" })
  public gif!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileRequestDTO)
  public files!: FileRequestDTO[];

  static build(
    message: string,
    reply_id: number | undefined,
    gif: string | undefined,
    files: FileRequestDTO[] | undefined
  ): MessageRequestDTO {
    const msgReqDTO = new MessageRequestDTO();

    msgReqDTO.message = message;

    if (reply_id !== undefined) {
      msgReqDTO.reply_id = reply_id;
    }

    if (gif !== undefined) {
      msgReqDTO.gif = gif;
    }

    if (files !== undefined) {
      msgReqDTO.files = files;
    }

    return msgReqDTO;
  }
}
