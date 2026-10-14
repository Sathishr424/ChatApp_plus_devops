import { EditMessageRequestDTO } from "../dto/request/EditMessageRequestDTO";
import { MessageRequestDTO } from "../dto/request/MessageRequestDTO";
import { PaginationDTO } from "../dto/request/PaginationDTO";
import { MessageResponseDTO } from "../dto/response/MessageResponseDTO";
import { WithPaginationDTO } from "../dto/response/WithPaginationDTO";
import { NoMessageFound } from "../exceptions/NoMessageFound";
import { NotAuthorised } from "../exceptions/NotAuthorised";
import { SentMessage, MessageFilter, EditMessage } from "../interfaces";
import { Message } from "../models/Message";
import OneToOneChatRepository from "../repositories/OneToOneChatRepository";

class OneToOneChatService {
  private repo = OneToOneChatRepository;

  async getMessagesSearchResults(from_id: number, to_id: number, search: string, pagination: PaginationDTO) {
    const message_ids: number[] = await this.repo.getMessagesSearchResults({
      AND: [
        {
          OR: [
            { from_id, to_id },
            { from_id: to_id, to_id: from_id }
          ]
        },
        {
          message: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    }, pagination.offset, pagination.limit + 1);

    const hasMore = message_ids.length > pagination.limit;
    if (hasMore) message_ids.pop();

    return {
      nextOffset: pagination.offset + message_ids.length,
      hasMore,
      data: message_ids
    } as WithPaginationDTO<number[]>
  }

  async loadMessagesUntilMessageId(from_id: number, to_id: number, message_id: number, pagination: PaginationDTO) {
    const newOffset = await this.repo.loadMessagesUntilMessageId({
      OR: [
        { from_id, to_id },
        { from_id: to_id, to_id: from_id }
      ]
    } as MessageFilter, message_id, pagination.offset, pagination.limit + 1);

    const newLimit = newOffset - pagination.offset;
    return this.getUserMessages(from_id, to_id, PaginationDTO.build(newLimit, pagination.offset));
  }

  async getUserMessages(from_id: number, to_id: number, pagination: PaginationDTO) {
    const messages: Message[] = await this.repo.getMessages({
      OR: [
        { from_id, to_id },
        { from_id: to_id, to_id: from_id }
      ]
    } as MessageFilter, pagination.offset, pagination.limit + 1);

    const hasMore = messages.length > pagination.limit;
    if (hasMore) messages.pop();

    return {
      nextOffset: pagination.offset + messages.length,
      hasMore,
      data: messages.map(message => MessageResponseDTO.fromMessage(message))
    } as WithPaginationDTO<MessageResponseDTO[]>
  }

  async editMessage(from_id: number, messageRequest: EditMessageRequestDTO) {
    const message: Message = await this.repo.editMessage(from_id, {
      message: messageRequest.message,
      message_id: messageRequest.message_id
    } as EditMessage);

    return MessageResponseDTO.fromMessage(message);
  }

  async sentMessage(from_id: number, to_id: number, messageRequest: MessageRequestDTO) {
    const message: Message = await this.repo.sentMessage({
      from_id,
      to_id,
      message: messageRequest.message,
      ...(messageRequest.gif ? { gif: messageRequest.gif } : {}),
      ...(messageRequest.reply_id ? { reply_id: messageRequest.reply_id } : {}),
    } as SentMessage, messageRequest.files);

    return MessageResponseDTO.fromMessage(message);
  }

  private async getRawMessage(from_id: number, messageId: number) {
    const messages: Message[] = await this.repo.getMessages({
      id: messageId,
    } as MessageFilter, 0, 1);

    if (messages.length == 0) throw new NoMessageFound();
    const message = messages[0];

    if (message.from_id != from_id && message.to_id != from_id) throw new NotAuthorised();
    return message;
  }

  async getMessage(from_id: number, messageId: number) {
    const message = await this.getRawMessage(from_id, messageId);
    return MessageResponseDTO.fromMessage(message);
  }

  async deleteMessage(from_id: number, messageId: number) {
    return await this.repo.deleteMessage(from_id, messageId);
  }

  async markSeen(user_id: number, from_id: number) {
    await this.repo.markSeen(user_id, from_id);
    return true;
  }
}

export default new OneToOneChatService();
