import { prisma } from "../config/database/PrismaClient";
import { LoginUserDTO } from "../dto/request/LoginUserDTO";
import { RegisterUserDTO } from "../dto/request/RegisterUserDTO";
import { ServerError } from "../exceptions/ServerError";
import { UserEmailAlreadyInUse } from "../exceptions/UserEmailAlreadyInUse";
import { UserNotExists } from "../exceptions/UserNotExists";
import { WrongCredentials } from "../exceptions/WrongCredentials";
import { User } from "../models/User";
import { hashPassword, validatePassword } from "../utils/helper";

class AuthRepository {
  async login(userDTO: LoginUserDTO) {
    const user: User | null = await prisma.users.findFirst({
      where: {
        email: userDTO.email
      },
    })

    if (user === null) throw new UserNotExists();

    const isValid = await validatePassword(userDTO.password, user);
    if (!isValid) throw new WrongCredentials();

    return user;
  }

  async register(userDTO: RegisterUserDTO) {
    const userExist: User | null = await prisma.users.findFirst({
      where: {
        OR: [{ email: userDTO.email }]
      },
    });

    if (userExist !== null) {
      if (userExist.email == userDTO.email) throw new UserEmailAlreadyInUse();
      else throw new ServerError();
    }

    const hashedPassword = await hashPassword(userDTO.password);

    const user: User | null = await prisma.users.create({
      data: {
        username: userDTO.username,
        email: userDTO.email,
        password: hashedPassword
      }
    });

    return user;
  }
}

export default new AuthRepository();
