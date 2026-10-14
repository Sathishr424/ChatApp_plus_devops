import type { Pagination, SubscriptionTypingSocketResponse } from "@/interfaces";
import { type WithPagination } from "@/interfaces";
import ConfigService from "@/services/ConfigService";
import type { File as FileModal } from "@/types/File";
import { type Group } from "@/types/Group";
import { type Message } from "@/types/Message";
import { type Recipient } from "@/types/Recipient";
import { type User } from "@/types/User";
import React from "react";

export function formatErrorMessage(message: string) {
  return message.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}

export function shrinkMessage(message: string, limit: number = 15) {
  if (message.length > limit) return message.substring(0, limit) + "...";
  return message;
}

export function scrollToElement(element: HTMLElement | null, smooth: boolean = true) {
  element?.scrollIntoView({
    block: "center",
    ...(smooth ? {
      behavior: "smooth",
    } : {})
  });
}

export function scrollToElementTop(element: HTMLElement | null, smooth: boolean = true) {
  element?.scrollTo({
    top: 0,
    ...(smooth ? {
      behavior: "smooth",
    } : {})
  });
}

export function scrollToElementBottom(element: HTMLElement | null, smooth: boolean = true) {
  element?.scrollTo({
    top: element.scrollHeight,
    ...(smooth ? {
      behavior: "smooth",
    } : {})
  });
}

export function isScrollBarAtBottom(container: HTMLElement | null) {
  if (container) {
    return container.scrollHeight - Math.abs(container.scrollTop) - container.clientHeight < 5;
  }
  return false;
}

export function isScrollBarAtTop(container: HTMLElement | null) {
  if (container) {
    return Math.abs(container.scrollTop) <= 5;
  }
  return false;
}

export function isScrollBarNotAtTop(container: HTMLElement | null) {
  if (container) {
    return Math.abs(container.scrollTop) >= 250;
  }
  return false;
}

// eslint-disable-next-line
export async function handleAPIRequest(callback: any, setIsLoading: any) {
  try {
    setIsLoading(true);
    return await callback();
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    setIsLoading(false);
  }
}

export function fillRecipientDetailsOnUser(user: User): Recipient {
  return {
    ...user,
    is_group: false,
    name: user.username,
  }
}

export function updatePagination<T>(setPagination: React.Dispatch<React.SetStateAction<Pagination>>, data: WithPagination<T[]>) {
  setPagination(prev => (
    {
      ...prev,
      ...data,
      offset: data.nextOffset !== null && data.nextOffset !== undefined ? data.nextOffset : prev.offset,
      cursor: data.nextCursor !== null && data.nextCursor !== undefined ? data.nextCursor : prev.cursor,
      cursor_id: data.nextCursorId !== null && data.nextCursorId !== undefined ? data.nextCursorId : prev.cursor_id,
    }
  ))
}

export function fillRecipientDetailsOnGroup(group: Group): Recipient {
  return {
    ...group,
    is_group: true,
    name: group.name,
  }
}

export function isMessageIDFromTheActiveTab(recipient: Recipient, to_id: number, from_id: number, is_group: boolean) {
  return (is_group && recipient.is_group && to_id === recipient.id) || (!is_group && !recipient.is_group && (to_id === recipient.id || from_id === recipient.id))
}

export function isMessageIDFromRecipient(recipient: Recipient, to_id: number, from_id: number, is_group: boolean) {
  return (is_group && recipient.is_group && to_id === recipient.id) || (!is_group && !recipient.is_group && from_id === recipient.id)
}

export function isMessageFromTheActiveTab(recipient: Recipient, message: Message) {
  return isMessageIDFromTheActiveTab(recipient, message.is_group ? message.group_id! : message.to_id!, message.from_id, message.is_group);
  // return (message.is_group && recipient.is_group && message.group_id === recipient.id) || (!message.is_group && !recipient.is_group && (message.to_id === recipient.id || message.from_id === recipient.id))
}

export function isMessageFromRecipient(recipient: Recipient, message: Message) {
  return isMessageIDFromRecipient(recipient, message.is_group ? message.group_id! : message.to_id!, message.from_id, message.is_group);
  // return (message.is_group && recipient.is_group && message.group_id === recipient.id) || (!message.is_group && !recipient.is_group && message.from_id === recipient.id)
}

export function isTypingFromRecipient(recipient: Recipient, { from_id, is_group, group_id }: SubscriptionTypingSocketResponse) {
  return (recipient.is_group && is_group && recipient.id === group_id) || (!is_group && !recipient.is_group && recipient.id === from_id);
}

export function isSameRecipient(recipient1: Recipient | null, recipient2: Recipient | null) {
  if (recipient1 === null && recipient2 === null) return true;
  else if (recipient1 === null || recipient2 === null) return false;
  return recipient1.is_group == recipient2.is_group && recipient1.id === recipient2.id;
}

export function generateRandomString(length = 16) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function getStorageURL(file_id: string) {
  return ConfigService.getStorageURL() + "files/" + file_id;
}

export function downloadFile(file: FileModal) {
  const fileUrl = getStorageURL(file.storedName);

  const link = document.createElement("a");

  link.href = fileUrl;
  link.download = file.originalName || generateRandomString();
  link.target = "_blank";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatMessageBubbleDate(date: Date | string | null): string {
  if (date === null) return "";

  const now = new Date();
  const messageDate = new Date(date);

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const messageDay = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate()
  );

  const diffDays = Math.floor(
    (today.getTime() - messageDay.getTime()) /
    (1000 * 60 * 60 * 24)
  );

  const time = messageDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (diffDays === 0) {
    return time;
  }

  if (diffDays === 1) {
    return `Yesterday ${time}`;
  }

  if (diffDays < 7) {
    return `${messageDate.toLocaleDateString([], {
      weekday: "short",
    })} ${time}`;
  }

  return `${messageDate.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })}, ${time}`;
}

export function formatMessageDate(date: Date | string | null): string {
  if (date === null) return "";
  const now = new Date();
  date = new Date(date);

  // Remove time and compare calendar dates
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffMs = today.getTime() - messageDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Today
  if (diffDays === 0) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  // Yesterday
  if (diffDays === 1) {
    return "Yesterday";
  }

  // Within the last 7 days
  if (diffDays < 7) {
    return date.toLocaleDateString([], {
      weekday: "short",
    });
  }

  // Older
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export async function fileFromUrl(
  url: string,
  fileName: string
): Promise<File> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status}`);
  }

  const blob = await response.blob();

  return new File([blob], fileName, {
    type: blob.type,
  });
};
