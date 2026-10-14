import type { SentMessageDTO } from "@/dto/DTOs";
import type { WithPagination } from "@/interfaces";
import type { Message } from "@/types/Message";
import type { Pagination } from "@/interfaces";

export interface RecipientService {
  getMessageSearchIds(id: number, search: string, pagination: Pagination): Promise<WithPagination<number[]>>;

  getMessages(id: number, pagination: Pagination): Promise<WithPagination<Message[]>> 

  getMessagesUntilMessageId(id: number, message_id: number, offset: number, limit: number): Promise<WithPagination<Message[]>> 

  sentMessage(id: number, messageData: SentMessageDTO): Promise<Message> 

  deleteMessage(id: number, message_id: number): Promise<boolean> 

  markSeen(id: number): Promise<boolean>; 
}
