import type { Pagination, WithPagination } from "@/interfaces";
import type { Group } from "@/types/Group";
import type { User } from "@/types/User";
import APIService from "./APIService";

class ConversationService {
  private baseURL: string = "conversations";

  async getRecent(search: string, pagination: Pagination): Promise<WithPagination<(User | Group)[]>> {
    try {
      const data = await APIService.request(`${this.baseURL}/recent?cursor_id=${pagination.cursor_id}&cursor=${pagination.cursor?.toISOString()}&limit=${pagination.limit}&search=${search}`, "GET", {});
      return data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUnread(search: string, pagination: Pagination): Promise<WithPagination<(User | Group)[]>> {
    try {
      const data = await APIService.request(`${this.baseURL}/unread?cursor_id=${pagination.cursor_id}&cursor=${pagination.cursor?.toISOString()}&limit=${pagination.limit}&search=${search}`, "GET", {});
      return data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getGroups(search: string, pagination: Pagination): Promise<WithPagination<Group[]>> {
    try {
      const data = await APIService.request(`${this.baseURL}/groups?cursor_id=${pagination.cursor_id}&cursor=${pagination.cursor?.toISOString()}&limit=${pagination.limit}&search=${search}`, "GET", {});
      return data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new ConversationService();
