import { GroupRaw } from "../dto/common/GroupRaw";
import { UserRaw } from "../dto/common/UserRaw";
import { PaginationDTO } from "../dto/request/PaginationDTO";
import { GroupResponseDTO } from "../dto/response/GroupResponseDTO";
import { UserResponseDTO } from "../dto/response/UserResponseDTO";
import { WithPaginationDTO } from "../dto/response/WithPaginationDTO";
import ConversationRepository from "../repositories/ConversationRepository";

class ConversationService {
  private repo = ConversationRepository;

  async getRecent(user_id: number, pagination: PaginationDTO) {
    const recipients = await this.repo.getRecent(user_id, pagination.search, pagination.cursor, pagination.cursor_id, pagination.limit + 1);

    const data = recipients.map(recipient => {
      if ("username" in recipient) {
        return UserResponseDTO.fromUserRaw(recipient as UserRaw);
      } else {
        return GroupResponseDTO.fromGroupRaw(recipient as GroupRaw);
      }
    });

    const hasMore = data.length > pagination.limit;
    if (hasMore) data.pop();

    return {
      nextCursor: data.length > 0 ? data[data.length - 1].last_updated : pagination.cursor,
      nextCursorId: data.length > 0 ? data[data.length - 1].id : pagination.cursor_id,
      hasMore,
      data
    } as WithPaginationDTO<(UserResponseDTO | GroupResponseDTO)[]>
  }

  async getUnraed(user_id: number, pagination: PaginationDTO) {
    const recipients = await this.repo.getUnread(user_id, pagination.search, pagination.cursor, pagination.cursor_id, pagination.limit + 1);

    const data = recipients.map(recipient => {
      if ("username" in recipient) {
        return UserResponseDTO.fromUserRaw(recipient as UserRaw);
      } else {
        return GroupResponseDTO.fromGroupRaw(recipient as GroupRaw);
      }
    });

    const hasMore = data.length > pagination.limit;
    if (hasMore) data.pop();

    return {
      nextCursor: data.length > 0 ? data[data.length - 1].last_updated : pagination.cursor,
      nextCursorId: data.length > 0 ? data[data.length - 1].id : pagination.cursor_id,
      hasMore,
      data
    } as WithPaginationDTO<(UserResponseDTO | GroupResponseDTO)[]>
  }

  async getGroups(user_id: number, pagination: PaginationDTO) {
    const recipients = pagination.search.length > 0 ? await this.repo.getGroupsWithSearch(user_id, pagination.search, pagination.cursor, pagination.cursor_id, pagination.limit + 1) : await this.repo.getGroups(user_id, pagination.cursor, pagination.cursor_id, pagination.limit + 1);

    const data = recipients.map(recipient => {
      return GroupResponseDTO.fromGroupRaw(recipient as GroupRaw);
    });

    const hasMore = data.length > pagination.limit;
    if (hasMore) data.pop();

    return {
      nextCursor: data.length > 0 ? data[data.length - 1].last_updated : pagination.cursor,
      nextCursorId: data.length > 0 ? data[data.length - 1].id : pagination.cursor_id,
      hasMore,
      data
    } as WithPaginationDTO<GroupResponseDTO[]>
  }
}

export default new ConversationService();
