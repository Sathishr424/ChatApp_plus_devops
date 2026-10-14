import { useAuth } from "@/contexts/AuthContext";
import { useUsersContext } from "@/contexts/UsersContext";
import { SubscriptionType, type SubscriptionTypingSocketResponse } from "@/interfaces";
import type { Recipient } from "@/types/Recipient";
import { fillRecipientDetailsOnUser, isTypingFromRecipient } from "@/utils/helper";
import MessageSystem from "@/utils/MessageSystem";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useTyping() {
  const [isTyping, setIsTyping] = useState<Recipient | null>(null);
  const typingTimeOut = useRef<number | null>(null);

  const { selectedRecipient, recipientDetail } = useUsersContext();
  const { user } = useAuth();

  const handleTypingEvent = useCallback((data: SubscriptionTypingSocketResponse) => {
    if (user === null || selectedRecipient === null) return;

    if (isTypingFromRecipient(selectedRecipient, data)) {
      if (data.is_group) {
        const member = recipientDetail?.members?.find(member => {
          return member.id === data.from_id
        });
        if (member) setIsTyping(fillRecipientDetailsOnUser(member))
      } else {
        setIsTyping(data.from_id === user.id ? user : selectedRecipient);
      }

      if (typingTimeOut.current !== null) {
        clearTimeout(typingTimeOut.current);
      }

      typingTimeOut.current = setTimeout(() => {
        setIsTyping(null);
        typingTimeOut.current = null;
      }, 1000);
    }
  }, [recipientDetail, selectedRecipient, user])

  useEffect(() => {
    if (selectedRecipient === null || user === null) return;

    const unSubscribeTyping = MessageSystem.subscribe(SubscriptionType.TYPING, handleTypingEvent);

    return () => {
      unSubscribeTyping();
      if (typingTimeOut.current !== null) {
        clearTimeout(typingTimeOut.current);
        typingTimeOut.current = null;
      }
    }
  }, [selectedRecipient, user, handleTypingEvent])

  return {
    isTyping
  }
}
