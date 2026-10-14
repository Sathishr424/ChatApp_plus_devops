import type { Pagination } from "@/interfaces";
import type { SentMessageDTO } from "../dto/DTOs";
import type { WithPagination } from "@/interfaces";
import type { Message } from "@/types/Message";
import APIService from "./APIService";
import type { RecipientService } from "./RecipientService";

class OneToOneChatService implements RecipientService {
  private baseURL = "conversations/one-to-one";

  async getMessageSearchIds(userId: number, search: string, pagination: Pagination): Promise<WithPagination<number[]>> {
    try {
      const data = await APIService.request(`${this.baseURL}/${userId}/messages/search/${search}?offset=${pagination.offset}&limit=${pagination.limit}`, "GET", {});
      return data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getMessages(userId: number, pagination: Pagination): Promise<WithPagination<Message[]>> {
    try {
      const data = await APIService.request(`${this.baseURL}/${userId}/messages?offset=${pagination.offset}&limit=${pagination.limit}`, "GET", {});
      return data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getMessagesUntilMessageId(userId: number, message_id: number, offset: number, limit: number): Promise<WithPagination<Message[]>> {
    try {
      const data = await APIService.request(`${this.baseURL}/${userId}/messages/load-until/${message_id}?offset=${offset}&limit=${limit}`, "GET", {});
      return data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async sentMessage(userId: number, messageData: SentMessageDTO): Promise<Message> {
    try {
      const data = await APIService.request(`${this.baseURL}/${userId}/messages`, "POST", messageData);
      return data.message;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteMessage(_: number, message_id: number): Promise<boolean> {
    try {
      const data = await APIService.request(`${this.baseURL}/messages/${message_id}`, "DELETE", {});
      return data.success;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async markSeen(userId: number): Promise<boolean> {
    try {
      const data = await APIService.request(`${this.baseURL}/messages/${userId}/seen`, "PATCH", {});
      return data.success;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new OneToOneChatService();
