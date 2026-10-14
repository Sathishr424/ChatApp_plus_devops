import { IsNumber, IsOptional } from "class-validator";
import DTORequest from "../../interfaces/DTORequest";

export class UsersRequestDTO implements DTORequest {
  @IsOptional()
  @IsNumber({}, { message: "limit should be number" })
  public limit: number = 20;

  @IsOptional()
  @IsNumber({}, { message: "offset should be number" })
  public offset: number = 0;
}
