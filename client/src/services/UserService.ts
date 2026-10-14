import type { UserUpdateRequestDTO } from "@/dto/DTOs";
import type { Pagination, WithPagination } from "@/interfaces";
import type { User } from "@/types/User";
import APIService from "./APIService";

class UserService {
  private baseURL = "users"

  async getUserData(user_id: number): Promise<User> {
    try {
      const data = await APIService.request(`${this.baseURL}/${user_id}`, "GET", {});
      return data.user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async me(): Promise<User> {
    try {
      const data = await APIService.request(`${this.baseURL}/me`, "GET", {});
      return data.user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async searchUsers(search: string, pagination: Pagination): Promise<WithPagination<User[]>> {
    try {
      const data = await APIService.request(`${this.baseURL}/?offset=${pagination.offset}&limit=${pagination.limit}&search=${search}`, "GET", {});
      return data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateUser(userData: UserUpdateRequestDTO): Promise<User> {
    try {
      const data = await APIService.request(`${this.baseURL}/me`, "PATCH", userData);
      return data.user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new UserService();
