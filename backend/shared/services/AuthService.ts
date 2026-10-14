import { LoginUserDTO } from "../dto/request/LoginUserDTO";
import { RegisterUserDTO } from "../dto/request/RegisterUserDTO";
import { User } from "../models/User";
import AuthRepository from "../repositories/AuthRepository";
import JWTService from "./JWTService";

class AuthService {
  private repo = AuthRepository;
  private jwtService = JWTService;

  async login(userDTO: LoginUserDTO): Promise<string> {
    const user: User = await this.repo.login(userDTO);
    return this.jwtService.sign(user);
  }

  async register(userDTO: RegisterUserDTO) {
    await this.repo.register(userDTO);
  }

  async logout() {

  }
}

export default new AuthService();
