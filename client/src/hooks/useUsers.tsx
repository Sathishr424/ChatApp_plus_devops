import { useAuth } from "@/contexts/AuthContext";
import { useSocketContext } from "@/contexts/SocketContext";
import type { WithPagination } from "@/interfaces";
import { RecipientType, type Pagination, type UsersProps } from "@/interfaces";
import ConversationService from "@/services/ConversationService";
import GroupService from "@/services/GroupService";
import type { Group } from "@/types/Group";
import type { Recipient } from "@/types/Recipient";
import type { User } from "@/types/User";
import { fillRecipientDetailsOnGroup, fillRecipientDetailsOnUser, isSameRecipient, isScrollBarAtBottom } from "@/utils/helper";
import { useCallback, useEffect, useState } from "react";
import usePagination from "./UsePagination";

export function useUsers() {
  const { user } = useAuth();
  const { emitJoinRooms, emitMessagesSeen } = useSocketContext();
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [recipientDetail, setRecipientDetails] = useState<Recipient | null>(null);

  const [currentTab, setCurrentTab] = useState(RecipientType.RECENT);

  const fetchRecipients = useCallback(async (search: string, pagination: Pagination) => {
    const convertResponseData = (data: (Group | User)[]) => {
      const recipients = data.map(recipient => {
        if (recipient.is_group) return fillRecipientDetailsOnGroup(recipient as Group);
        else return fillRecipientDetailsOnUser(recipient as User);
      })
      emitJoinRooms({ ids: recipients.map(recipient => ({ id: recipient.id, is_group: recipient.is_group })) });
      return recipients;
    }

    const data: WithPagination<Group[] | (User | Group)[]> = currentTab === RecipientType.GROUP ? await ConversationService.getGroups(search, pagination) : currentTab === RecipientType.RECENT ? await ConversationService.getRecent(search, pagination) : await ConversationService.getUnread(search, pagination);
    return {
      hasMore: data.hasMore,
      nextOffset: data.nextOffset,
      nextCursor: new Date(data.nextCursor!),
      nextCursorId: data.nextCursorId,
      data: convertResponseData(data.data)
    }
  }, [currentTab, emitJoinRooms])

  const { reset, data: recipients, setData: setRecipients, fetchMore, isLoading, search: searchUser, setSearch: setSearchUser } = usePagination<Recipient>(fetchRecipients);

  useEffect(() => {
    if (selectedRecipient === null || user === null) return;

    // When user selected a different user we simply mark that we read all the messages from that user
    // So se emit a event to socket to let it know that we read all the messages from that user
    emitMessagesSeen({
      from_id: user.id,
      to_id: selectedRecipient.id,
      is_group: selectedRecipient.is_group,
    });

    setRecipients(prev => {
      return prev.map(old_recipient => {
        if (!isSameRecipient(selectedRecipient, old_recipient)) return old_recipient;
        return {
          ...old_recipient,
          unread_count: 0
        }
      })
    });

    // const markMessagesSeen = async (recipient: Recipient) => {
    //   const recipientService = selectedRecipient.is_group ? GroupChatService : OneToOneChatService;
    //   const success: boolean = await recipientService.markSeen(recipient.id);
    //   if (success) {
    //     setRecipients(prev => {
    //       return prev.map(old_recipient => {
    //         if (!isSameRecipient(recipient, old_recipient)) return old_recipient;
    //         return {
    //           ...old_recipient,
    //           unread_count: 0
    //         }
    //       })
    //     });
    //   }
    // }
    // markMessagesSeen(selectedRecipient);

    // Getting detailed info about recipient
    const fetchRecipient = async () => {
      if (selectedRecipient.is_group) {
        const group = await GroupService.getGroup(selectedRecipient.id);
        setRecipientDetails(fillRecipientDetailsOnGroup(group));
      } else {
        setRecipientDetails({
          ...selectedRecipient
        });
      }
    }

    fetchRecipient();
  }, [selectedRecipient, emitMessagesSeen, user])

  useEffect(() => {
    reset();
    setSearchUser("");
  }, [currentTab]);

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;

    if (isScrollBarAtBottom(container)) {
      fetchMore();
    }
  }

  return {
    users: recipients,
    selectedRecipient,
    currentTab,
    isLoading,
    searchUser,
    recipientDetail,

    setUsers: setRecipients,
    setSelectedRecipient,
    handleScroll,
    setCurrentTab,
    setSearchUser,
    resetSearch: reset
  } as UsersProps
}
