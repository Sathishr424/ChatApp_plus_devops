import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import DTORequest from "../../interfaces/DTORequest";

export class PaginationDTO implements DTORequest {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  public limit: number = 20;

  @IsOptional()
  @Type(() => String)
  @IsString()
  public search: string = "";

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  public offset: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  public cursor_id: number = -1; 

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public cursor: Date = new Date();

  public static build(limit: number, offset: number, cursor: Date = new Date()) {
    const page = new PaginationDTO();
    page.offset = offset;
    page.limit = limit;
    page.cursor = cursor;
    return page;
  }
}
