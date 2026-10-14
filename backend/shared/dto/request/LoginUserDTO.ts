import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import DTORequest from "../../interfaces/DTORequest";

export class LoginUserDTO implements DTORequest {
    @IsEmail({}, { message: 'Invalid email format.' })
    @IsNotEmpty({ message: 'Email is required.' })
    public email!: string;

    @IsNotEmpty({ message: 'Password is required.' })
    public password!: string;
}
