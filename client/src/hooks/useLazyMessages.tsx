import { useUsersContext } from "@/contexts/UsersContext";
import { type WithPagination } from "@/interfaces";
import { type Message } from "@/types/Message";
import { type Recipient } from "@/types/Recipient";
import type { Pagination } from "@/interfaces";
import GroupChatService from "@/services/GroupChatService";
import OneToOneChatService from "@/services/OneToOneChatService";
import { handleAPIRequest, isScrollBarAtBottom, isScrollBarAtTop, isScrollBarNotAtTop } from "@/utils/helper";
import { SatToast, ToastType } from "@/utils/SatAlert";
import { useCallback, useEffect, useRef, useState } from "react";
import usePagination from "./UsePagination";
import { useAuth } from "@/contexts/AuthContext";

export default function useLazyMessages(setUnread: React.Dispatch<React.SetStateAction<number>>) {
  const { selectedRecipient } = useUsersContext();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const fetchMessages = useCallback(async (_: string, pagination: Pagination) => {
    if (selectedRecipient === null) throw new Error("Reciepient not selected");
    const recipientService = selectedRecipient.is_group ? GroupChatService : OneToOneChatService;
    const data = await recipientService.getMessages(selectedRecipient!.id, pagination);

    return {
      ...data,
      data: data.data.map(msg => {
        if (msg.is_group || msg.to_id != user?.id) return msg;
          return {
            ...msg,
            updatedAt: !msg.seen ? new Date() : msg.updatedAt,
            seen: true,
          }
      })
    }
  }, [selectedRecipient])

  const { reset, fetchMore, isLoading, pagination, setPagination, setIsLoading, data: messages, setData: setMessages } = usePagination<Message>(fetchMessages);

  const loadMessagesUntilMessageId = useCallback(async (recipient: Recipient, message_id: number) => {
    const pageData: WithPagination<Message[]> = await handleAPIRequest(async () => {
      const recipientService = recipient.is_group ? GroupChatService : OneToOneChatService;
      return await recipientService.getMessagesUntilMessageId(recipient.id, message_id, pagination.offset!, pagination.limit);
    }, setIsLoading);

    setPagination((prev) => {
      return {
        limit: prev.limit,
        offset: prev.offset! + pageData.data.length,
        cursor_id: pageData.nextCursorId,
        cursor: pageData.nextCursor,
        hasMore: pageData.hasMore
      }
    });

    setMessages(prev => [...prev, ...pageData.data]);
  }, [pagination])


  const scrollToMessage = useCallback(async (recipient: Recipient, message_id: number) => {
    const container = containerRef.current;
    if (container === null || message_id === null) return;
    const element = document.getElementById(`message-${message_id}`);

    if (element === null) {
      await loadMessagesUntilMessageId(recipient, message_id);
    }

    setTimeout(() => {
      const element = document.getElementById(`message-${message_id}`);
      if (element === null) return SatToast.alert("Not able to find the message", ToastType.ERROR);

      const handleScrollEnd = () => {
        element.classList.add('message-highlight');
        setTimeout(() => {
          element.classList.remove('message-highlight');
          container.removeEventListener("scrollend", handleScrollEnd);
        }, 1000);
      };

      container.addEventListener("scrollend", handleScrollEnd);
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);

  }, [loadMessagesUntilMessageId])

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    if (selectedRecipient === null) return;

    setShowScrollBottom(isScrollBarNotAtTop(container));

    if (isScrollBarAtTop(container)) {
      setUnread(0);
    } else if (!isLoading && isScrollBarAtBottom(container) && pagination.hasMore) {
      fetchMore();
    }
  }

  useEffect(() => {
    if (selectedRecipient === null) return;

    reset();
  }, [selectedRecipient]);

  return {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    pagination,
    setPagination,
    scrollToMessage,
    containerRef,
    handleScroll,
    showScrollBottom
  }
}
