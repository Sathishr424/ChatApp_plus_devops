import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import DTORequest from "../../interfaces/DTORequest";
import { Type } from "class-transformer";
import { FileRequestDTO } from "./MessageRequestDTO";

export class GroupRequestDTO implements DTORequest {
  @IsOptional()
  @Type(() => FileRequestDTO)
  public avatarFile!: FileRequestDTO;

  @IsNotEmpty({ message: "Name is required." })
  public name!: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  public members!: number[];
}
