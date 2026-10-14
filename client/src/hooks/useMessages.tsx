import { useAuth } from "@/contexts/AuthContext";
import { useResponsiveness } from "@/contexts/ResponsivenessContext";
import { useSocketContext } from "@/contexts/SocketContext";
import { useUsersContext } from "@/contexts/UsersContext";
import { SubscriptionType, type DeleteMessageSocketResponse, type GifItemData, type MessagesProps, type MessagesSeenSocketResponse } from "@/interfaces";
import GroupService from "@/services/GroupService";
import UserService from "@/services/UserService";
import type { Message } from "@/types/Message";
import type { Recipient } from "@/types/Recipient";
import { fillRecipientDetailsOnGroup, fillRecipientDetailsOnUser, isMessageFromRecipient, isMessageFromTheActiveTab, isMessageIDFromTheActiveTab, isSameRecipient, isScrollBarAtTop, isScrollBarNotAtTop, scrollToElementTop } from "@/utils/helper";
import MessageSystem from "@/utils/MessageSystem";
import { SatToast, ToastType } from "@/utils/SatAlert";
import { useCallback, useEffect, useState } from "react";
import useLazyMessages from "./useLazyMessages";
import useMessagesSearch from "./useMessagesSearch";
import useTyping from "./useTyping";

export function useMessages() {
  const { user } = useAuth();
  const { selectedRecipient, setUsers, users } = useUsersContext();
  const { isTyping } = useTyping();
  const [unread, setUnread] = useState(0);
  const [reply, setReply] = useState<Message | null>(null);
  const [GIF, setGIF] = useState<GifItemData | null>(null);
  const [edit, setEdit] = useState<Message | null>(null);
  const { emitMessagesSeen } = useSocketContext();
  const { isSelectedRecipientOnVisibleScreen, mobileView } = useResponsiveness();

  const { handleScroll, containerRef, setPagination, isLoading, scrollToMessage, messages, setMessages, showScrollBottom } = useLazyMessages(setUnread);

  const addNewMessageToTheMessagesTab = useCallback((message: Message, myMessage: boolean) => {
    if (containerRef.current === null) return;
    if (!isScrollBarAtTop(containerRef.current) && !myMessage) setUnread(prev => prev + 1);
    else if (!myMessage || !isScrollBarNotAtTop(containerRef.current)) {
      setUnread(0);
      setTimeout(() => {
        scrollToElementTop(containerRef.current);
      }, 500);
    }

    setMessages(prev => [message, ...prev]);
    setPagination(prev => (
      {
        ...prev,
        offset: prev.offset! + 1
      }
    ))
  }, [])

  const populateMessageFieldsToRecipient = (message: Message) => {
    return {
      last_message_id: message.id,
      last_updated: message.updatedAt,
      last_message: message.message,
      last_message_deleted: message.deleted,
      last_message_edited: message.edited,
      last_message_gif: message.gif,
      last_message_attachments: message.files?.length ?? 0,
    }
  }

  const addNewMessage = useCallback(async (message: Message) => {
    // console.log("New message recieved:", message);
    if (selectedRecipient !== null && isMessageFromTheActiveTab(selectedRecipient, message)) {
      addNewMessageToTheMessagesTab(message, (user?.id === message.from_id));
    } else {
      SatToast.alert(`New message received from: ${message.is_group ? (message.group?.name + " Group") : message.from?.username}`, ToastType.INFO);
    }

    // Checking if the sender is in the current user list and if not we simply fetch add them and sort the users list based on last received message
    let addUser: Recipient | null = null;
    if (message.is_group) {
      const exist = users.some(usr => {
        return usr.is_group && usr.id === message.group_id;
      });

      if (!exist) {
        addUser = fillRecipientDetailsOnGroup((await GroupService.getGroup(message.group_id!)));
      }
    } else {
      const needed_user_id = message.from_id === user?.id ? message.to_id! : message.from_id;
      const exist = users.some(usr => {
        return !usr.is_group && usr.id === needed_user_id;
      });

      if (!exist) {
        addUser = fillRecipientDetailsOnUser((await UserService.getUserData(needed_user_id)));
      }
    }

    // If are on mobile sized screen then even if we on selectedRecipient that chat winodw won't be visible to us right, so we don't have to make the messages sent by the user as seen and also don't have to update the UI on unread messages

    // When we receive a message from the selected user, that means we read the message the moment it arrived since we have this message tab opened with the selected user, so we mark it as seen.
    if (isSelectedRecipientOnVisibleScreen() && user !== null && selectedRecipient !== null && isMessageFromRecipient(selectedRecipient, message)) {
      // const recipientService = selectedRecipient.is_group ? GroupChatService : OneToOneChatService;
      // await recipientService.markSeen(selectedRecipient.id);
      emitMessagesSeen({
        from_id: user.id,
        to_id: selectedRecipient.id,
        is_group: selectedRecipient.is_group,
      });
    }

    // Increasing the sender user unread_count and assing the received message since we received a new message from that user and also that is not the user that is currently opened in the message tab
    setUsers(prevUsers => {
      const newUsers = [
        ...prevUsers.map(usr => {
          if ((!usr.is_group && usr.id === user?.id) || !isMessageFromTheActiveTab(usr, message)) {
            return usr;
          }

          return {
            ...usr,
            unread_count: !isSameRecipient(usr, selectedRecipient) || !isSelectedRecipientOnVisibleScreen() ? usr.unread_count + 1 : usr.unread_count,
            ...populateMessageFieldsToRecipient(message),
          };
        }),
        ...(addUser != null ? [{
          ...addUser,
          unread_count: 1,
          ...populateMessageFieldsToRecipient(message),
        }] : [])
      ];

      newUsers.sort((a, b) => {
        if (a.last_updated === null && b.last_updated === null) return 0;
        if (a.last_updated === null) return 1;
        if (b.last_updated === null) return -1;

        if (a.last_updated > b.last_updated) return -1;
        if (a.last_updated < b.last_updated) return 1;

        return 0
      });

      return newUsers;
    });
  }, [addNewMessageToTheMessagesTab, emitMessagesSeen, isSelectedRecipientOnVisibleScreen, mobileView, selectedRecipient, user, users])

  const editMessage = useCallback(async (message: Message) => {
    if (selectedRecipient !== null && isMessageFromTheActiveTab(selectedRecipient, message)) {
      setMessages(prev => {
        return prev.map(msg => {
          if (msg.id !== message.id) return msg;
          // Reason we are simply not returning the while edited messages is because we don't send files to the socket when we emit the edit message event, so the socket server also will not send the files data so we are using already existed files field in the msg
          return {
            ...message,
            files: msg.files
          };
        })
      });
    }

    // Edit message if it's the last message we received from that user/group
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (isMessageFromTheActiveTab(user, message) && user.last_message_id === message.id) {
          return {
            ...user,
            ...populateMessageFieldsToRecipient(message)
          };
        }

        return user;
      })
    );
  }, [selectedRecipient, user])

  const deleteMessage = useCallback(async (data: DeleteMessageSocketResponse) => {
    if (selectedRecipient !== null && isMessageIDFromTheActiveTab(selectedRecipient, data.to_id, data.from_id, data.is_group)) {
      setMessages(prev => {
        return prev.map(msg => {
          if (msg.id !== data.message_id) return msg;
          return {
            ...msg,
            deleted: true,
            message: ""
          }
        })
      });
    }

    // Delete message if it's the last message we received from that user/group
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (isMessageIDFromTheActiveTab(user, data.to_id, data.from_id, data.is_group) && user.last_message_id === data.message_id) {
          return {
            ...user,
            last_message_deleted: true,
            last_message: ""
          };
        }
        return user;
      })
    );
  }, [selectedRecipient, user])

  const messagesSeen = useCallback(async (data: MessagesSeenSocketResponse) => {
    // TODO: Later here update the individual users on the group seen status
    if (data.is_group || selectedRecipient?.is_group || selectedRecipient?.id !== data.from_id) return;
    setMessages(prev => {
      return prev.map(msg => {
        if (msg.to_id != data.from_id) return msg;
        return {
          ...msg,
          seen: true,
          updatedAt: !msg.seen ? new Date() : msg.updatedAt,
        }
      })
    });
  }, [selectedRecipient, user])

  const messagesSearchData = useMessagesSearch(scrollToMessage);

  useEffect(() => {
    const unSubscribeMessages = MessageSystem.subscribe(SubscriptionType.MESSAGE, async (message: Message) => {
      addNewMessage(message)
    });
    const unSubscribeEditMessages = MessageSystem.subscribe(SubscriptionType.EDIT_MESSAGE, async (message: Message) => {
      editMessage(message)
    });
    const unSubscribeDeleteMessages = MessageSystem.subscribe(SubscriptionType.DELETE_MESSAGE, async (data) => {
      deleteMessage(data);
    });
    const unSubscribeMessagesSeen = MessageSystem.subscribe(SubscriptionType.MESSAGES_SEEN, async (data) => {
      messagesSeen(data);
    });

    return () => {
      unSubscribeMessages();
      unSubscribeEditMessages();
      unSubscribeDeleteMessages();
      unSubscribeMessagesSeen();
    }
  }, [addNewMessage, editMessage, deleteMessage, messagesSeen, selectedRecipient, user?.id])

  return {
    containerRef,
    handleScroll,
    messages,
    setMessages,
    isTyping,
    unread,
    isLoading,
    scrollToMessage,
    messagesSearchData,
    edit,
    setEdit,
    reply,
    setReply,
    GIF,
    setGIF,
    showScrollBottom
  } as MessagesProps
}
