import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import DTORequest from "../../interfaces/DTORequest";
import { FileRequestDTO } from "./MessageRequestDTO";

export class UsersUpdateDTO implements DTORequest {
  @IsOptional()
  @Type(() => FileRequestDTO)
  public avatarFile!: FileRequestDTO;


  @IsNotEmpty({ message: 'Fullname is required' })
  public fullname!: string
}
