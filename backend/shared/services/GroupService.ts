import { GroupRequestDTO } from "../dto/request/GroupRequestDTO";
import { PaginationDTO } from "../dto/request/PaginationDTO";
import { GroupResponseDTO } from "../dto/response/GroupResponseDTO";
import GroupRepository from "../repositories/GroupRepository";

class GroupService {
  private repo = GroupRepository;

  async createGroup(user_id: number, groupDTO: GroupRequestDTO) {
    const group = await this.repo.createGroup(user_id, groupDTO);
    return GroupResponseDTO.fromGroup(group);
  }

  async getGroup(user_id: number, group_id: number) {
    const group = await this.repo.getGroup(user_id, group_id)
    return GroupResponseDTO.fromGroup(group);
  }

  async getAllGroupIds(user_id: number) {
    return await this.repo.getGroupIds(user_id);
  }

  async getGroups(user_id: number, pagination: PaginationDTO) {
    const groups = await this.repo.getGroups(user_id, pagination.offset, pagination.limit);
    return groups.map(group => GroupResponseDTO.fromGroup(group));
  }

  async getGroupMemberIds(user_id: number, group_id: number) {
    return await this.repo.getGroupMemberIds(user_id, group_id);
  }

  async deleteGroup(user_id: number, group_id: number) {
    return await this.repo.deleteGroup(user_id, group_id);
  }

  async UpdateGroup(user_id: number, group_id: number, groupDTO: GroupRequestDTO) {
    const group = await this.repo.UpdateGroup(user_id, group_id, groupDTO);
    return GroupResponseDTO.fromGroup(group);
  }
}

export default new GroupService();
