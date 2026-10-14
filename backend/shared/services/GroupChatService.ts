import { EditMessageRequestDTO } from "../dto/request/EditMessageRequestDTO";
import { MessageRequestDTO } from "../dto/request/MessageRequestDTO";
import { PaginationDTO } from "../dto/request/PaginationDTO";
import { GroupMessageResponseDTO } from "../dto/response/GroupMessageResponseDTO";
import { WithPaginationDTO } from "../dto/response/WithPaginationDTO";
import { NoMessageFound } from "../exceptions/NoMessageFound";
import { EditMessage, MessageFilter, SentGroupMessage } from "../interfaces";
import { GroupMessage } from "../models/GroupMessage";
import GroupChatRepository from "../repositories/GroupChatRepository";

class GroupChatService {
  private repo = GroupChatRepository;

  async getMessagesSearchResults(group_id: number, search: string, pagination: PaginationDTO) {
    const message_ids: number[] = await this.repo.getMessagesSearchResults({
      message: {
        contains: search,
        mode: "insensitive"
      },
      group_id
    } as MessageFilter, pagination.offset, pagination.limit + 1);

    const hasMore = message_ids.length > pagination.limit;
    if (hasMore) message_ids.pop();

    return {
      nextOffset: pagination.offset + message_ids.length,
      hasMore,
      data: message_ids
    } as WithPaginationDTO<number[]>
  }

  async loadMessagesUntilMessageId(group_id: number, message_id: number, pagination: PaginationDTO) {
    const newOffset = await this.repo.loadMessagesUntilMessageId({
      group_id
    } as MessageFilter, message_id, pagination.offset, pagination.limit + 1);

    const newLimit = newOffset - pagination.offset;
    return this.getGroupMessages(group_id, PaginationDTO.build(newLimit, pagination.offset));
  }

  async getGroupMessages(group_id: number, pagination: PaginationDTO) {
    const messages: GroupMessage[] = await this.repo.getMessages({
      group_id
    } as MessageFilter, pagination.offset, pagination.limit + 1);

    const hasMore = messages.length > pagination.limit;
    if (hasMore) messages.pop();

    return {
      nextOffset: pagination.offset + messages.length,
      hasMore,
      data: messages.map(message => GroupMessageResponseDTO.fromGroupMessage(message))
    } as WithPaginationDTO<GroupMessageResponseDTO[]>
  }

  async editMessage(from_id: number, messageRequest: EditMessageRequestDTO) {
    const message: GroupMessage = await this.repo.editMessage(from_id, {
      message: messageRequest.message,
      message_id: messageRequest.message_id
    } as EditMessage);

    return GroupMessageResponseDTO.fromGroupMessage(message);
  }

  async sentMessage(from_id: number, group_id: number, messageRequest: MessageRequestDTO) {
    const message: GroupMessage = await this.repo.sentMessage({
      from_id,
      group_id,
      message: messageRequest.message,
      ...(messageRequest.gif ? { gif: messageRequest.gif } : {}),
      ...(messageRequest.reply_id ? { reply_id: messageRequest.reply_id } : {})
    } as SentGroupMessage, messageRequest.files);

    return GroupMessageResponseDTO.fromGroupMessage(message);
  }

  async getMessage(messageId: number) {
    const messages: GroupMessage[] = await this.repo.getMessages({
      id: messageId,
    } as MessageFilter, 0, 1);

    if (messages.length === 0) throw new NoMessageFound();
    return GroupMessageResponseDTO.fromGroupMessage(messages[0]);
  }

  async deleteMessage(from_id: number, messageId: number) {
    return await this.repo.deleteMessage(from_id, messageId);
  }

  async markSeen(user_id: number, group_id: number) {
    await this.repo.markSeen(user_id, group_id);
    return true;
  }
}

export default new GroupChatService();
