import type { LoginRequestDTO, RegisterRequestDTO } from "../dto/DTOs";
import type { User } from "@/types/User";
import APIService from "./APIService";
import JWTService from "./JWTService";
import UserService from "./UserService";

class AuthService {
  private baseURL = "auth";

  async isUserLoggedIn() {
    try {
      const data: User = await UserService.me();
      return data !== null && data.email !== undefined;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async login(request: LoginRequestDTO) {
    try {
      const data = await APIService.request(`${this.baseURL}/login`, "POST", { email: request.email, password: request.password });
      if (data?.token !== undefined) {
        JWTService.storeToken(data.token);
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async register(request: RegisterRequestDTO) {
    try {
      return await APIService.request(`${this.baseURL}/register`, "POST", { email: request.email, username: request.username, password: request.password });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async logout() {
    try {
      const data = await APIService.request(`${this.baseURL}/logout`, "POST", {});
      JWTService.removeToken();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new AuthService();
