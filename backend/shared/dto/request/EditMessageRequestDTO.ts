import { IsNotEmpty, IsNumber } from "class-validator";
import DTORequest from "../../interfaces/DTORequest";

export class EditMessageRequestDTO implements DTORequest {
  @IsNotEmpty({ message: 'message is required.' })
  public message!: string;

  @IsNumber({}, { message: "message_id should be number" })
  public message_id!: number;

  static build(message: string, message_id: number): EditMessageRequestDTO {
    const msgReqDTO = new EditMessageRequestDTO();
    msgReqDTO.message = message;
    msgReqDTO.message_id = message_id;
    return msgReqDTO
  }
}
