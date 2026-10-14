import type { Pagination } from "@/interfaces";
import type { SentMessageDTO } from "../dto/DTOs";
import type { WithPagination } from "@/interfaces";
import type { Message } from "@/types/Message";
import APIService from "./APIService";
import type { RecipientService } from "./RecipientService";

class GroupChatService implements RecipientService {
  private baseURL: string = "conversations/groups";

  async getMessageSearchIds(group_id: number, search: string, pagination: Pagination): Promise<WithPagination<number[]>> {
    try {
      const data = await APIService.request(`${this.baseURL}/${group_id}/messages/search/${search}?offset=${pagination.offset}&limit=${pagination.limit}`, "GET", {});
      return data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getMessages(group_id: number, pagination: Pagination): Promise<WithPagination<Message[]>> {
    try {
      const data = await APIService.request(`${this.baseURL}/${group_id}/messages?offset=${pagination.offset}&limit=${pagination.limit}`, "GET", {});
      return data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getMessagesUntilMessageId(group_id: number, message_id: number, offset: number, limit: number): Promise<WithPagination<Message[]>> {
    try {
      const data = await APIService.request(`${this.baseURL}/${group_id}/messages/load-until/${message_id}?offset=${offset}&limit=${limit}`, "GET", {});
      return data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async sentMessage(group_id: number, messageData: SentMessageDTO): Promise<Message> {
    try {
      const data = await APIService.request(`${this.baseURL}/${group_id}/messages`, "POST", messageData);
      return data.message;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteMessage(group_id: number, message_id: number): Promise<boolean> {
    try {
      const data = await APIService.request(`${this.baseURL}/${group_id}/messages/${message_id}`, "DELETE", {});
      return data.success;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async markSeen(group_id: number): Promise<boolean> {
    try {
      const data = await APIService.request(`${this.baseURL}/${group_id}/messages/seen`, "PATCH", {});
      return data.success;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new GroupChatService();
