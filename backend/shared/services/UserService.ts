import { PaginationDTO } from "../dto/request/PaginationDTO";
import { UsersUpdateDTO } from "../dto/request/UserUpdateDTO";
import { UserResponseDTO } from "../dto/response/UserResponseDTO";
import { WithPaginationDTO } from "../dto/response/WithPaginationDTO";
import { User } from "../models/User";
import UserRepository from "../repositories/UserRepository";

class UserService {
  private repo = UserRepository;

  async updateLastSeen(userId: number) {
    await this.repo.updateLastSeen(userId);
    return true;
  }

  async updateUser(userId: number, data: UsersUpdateDTO) {
    const updatedUser = await this.repo.updateUser(userId, data);
    return UserResponseDTO.fromUser(updatedUser);
  }

  async getUser(userId: number): Promise<UserResponseDTO> {
    const user: User = await this.repo.getUser(userId);
    return UserResponseDTO.fromUser(user);
  }

  async getUsers(user_id: number, pagination: PaginationDTO) {
    const users: User[] = await this.repo.getUsers(user_id, pagination.search, pagination.offset, pagination.limit + 1);
    const hasMore = users.length > pagination.limit;
    if (hasMore) users.pop();

    return {
      nextOffset: pagination.offset + users.length,
      hasMore,
      data: users.map(user => UserResponseDTO.fromUser(user))
    } as WithPaginationDTO<UserResponseDTO[]>
  }
}

export default new UserService();
