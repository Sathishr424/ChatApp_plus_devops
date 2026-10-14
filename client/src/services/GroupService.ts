import type { Pagination } from "@/interfaces";
import type { GroupCreateRequestDTO, GroupUpdateRequestDTO } from "../dto/DTOs";
import type { WithPagination } from "@/interfaces";
import type { Group } from "@/types/Group";
import APIService from "./APIService";

class GroupService {
  private baseURL = "groups"

  async createGroup(groupData: GroupCreateRequestDTO): Promise<Group> {
    try {
      const data = await APIService.request(`${this.baseURL}`, "POST", groupData);
      return data.group;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getGroup(group_id: number): Promise<Group> {
    try {
      const data = await APIService.request(`${this.baseURL}/${group_id}`, "GET", {});
      return data.group;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getGroups(search: string, pagination: Pagination): Promise<WithPagination<Group[]>> {
    try {
      const data = await APIService.request(`${this.baseURL}?cursor_id=${pagination.offset}&limit=${pagination.limit}&search=${search}`, "GET", {});
      return data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateGroup(group_id: number, groupData: GroupUpdateRequestDTO): Promise<Group> {
    try {
      const data = await APIService.request(`${this.baseURL}/${group_id}`, "PATCH", groupData);
      return data.group;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteGroup(group_id: number): Promise<Group> {
    try {
      const data = await APIService.request(`${this.baseURL}/${group_id}`, "DELETE", {});
      return data.success;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new GroupService();
