import { faFile, faFileZipper, faImage, faVideo, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { DeleteMessageSocket, EditMessageSocket, JoinRoomSocket, MessagesSeenSocket, SentMessageSocket, TypingSocket } from "@/dto/DTOs";
import type { Message } from "@/types/Message";
import type { Recipient } from "@/types/Recipient";
import type { RefObject } from "react";
import type { Socket } from "socket.io-client";
import type { User } from "@/types/User";

export type SubscriptionTypingSocketResponse = {
  from_id: number,
  group_id: number,
  is_group: boolean
}

export type SubscriptionOnlineSocketResponse = {
  user_id: number,
  status: boolean
}

export type DeleteMessageSocketResponse = {
  message_id: number,
  to_id: number
  from_id: number,
  is_group: boolean
}

export type MessagesSeenSocketResponse = {
  from_id: number,
  to_id: number
  is_group: boolean
}

export type MessageSubscriptionCallback = (message: Message) => void;
export type EditMessageSubscriptionCallback = (message: Message) => void;
export type MessagesSeenSubscriptionCallback = (data: MessagesSeenSocketResponse) => void;
export type DeleteMessageSubscriptionCallback = (data: DeleteMessageSocketResponse) => void;
export type TypingSubscriptionCallback = (data: SubscriptionTypingSocketResponse) => void;
export type OnlineSubscriptionCallback = (data: SubscriptionOnlineSocketResponse) => void;

export type SubscribeToTypingFunction = (user: Recipient, typingTimeOut: React.RefObject<number | null>, setIsTyping: React.Dispatch<React.SetStateAction<boolean>>) => (() => void);
export type ScrollToMessageFunction = (recipient: Recipient, messsage_id: number) => Promise<void>;

export enum SubscriptionType {
  MESSAGE,
  DELETE_MESSAGE,
  MESSAGES_SEEN,
  EDIT_MESSAGE,
  TYPING,
  ONLINE,
};

export type Subscriber<CallBack> = {
  id: number,
  callback: CallBack
}

export interface MessagesProps {
  messages: Message[],
  isTyping: Recipient,
  unread: number,
  isLoading: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
  messagesSearchData: MessasgesSearchProps,
  reply: Message,
  edit: Message,
  GIF: GifItemData,
  showScrollBottom: boolean

  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void,
  scrollToMessage: ScrollToMessageFunction,

  setMessages: React.Dispatch<React.SetStateAction<Message[] | null>>,
  setReply: React.Dispatch<React.SetStateAction<Message | null>>,
  setEdit: React.Dispatch<React.SetStateAction<Message | null>>,
  setGIF: React.Dispatch<React.SetStateAction<GifItemData | null>>,
}

export interface UsersProps {
  users: Recipient[],
  selectedRecipient: Recipient | null,
  recipientDetail: Recipient | null,
  currentTab: RecipientType,
  isLoading: boolean,
  searchUser: string,

  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void,
  resetSearch: () => void
  setUsers: React.Dispatch<React.SetStateAction<Recipient[]>>,
  setSelectedRecipient: React.Dispatch<React.SetStateAction<Recipient | null>>,
  setCurrentTab: React.Dispatch<React.SetStateAction<RecipientType>>,
  setSearchUser: React.Dispatch<React.SetStateAction<string>>,
}

export interface MessasgesSearchProps {
  search: string,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  nextResult: () => Promise<void>,
  prevResult: () => Promise<void>,
  searchModalToggle: boolean
  setSearchModalToggle: React.Dispatch<React.SetStateAction<boolean>>,
  isMore: () => boolean,
  getTotal: () => number,
  getIndex: () => number,
  isLoading: boolean
  doSearch: () => Promise<void>
}

export interface SocketProps {
  emitTyping: (typingData: TypingSocket) => void,
  emitSendMessage: (sendData: SentMessageSocket) => void,
  emitEditMessage: (sendData: EditMessageSocket) => void,
  emitDeleteMessage: (data: DeleteMessageSocket) => void,
  emitMessagesSeen: (data: MessagesSeenSocket) => void,
  emitGroupActivity: (data: { group_id: number, members: number[] }) => void,
  initializeSocket: (
    user_id: number,
    authToken: string
  ) => () => void,
  usersOnline: Set<number>,
  usersLastSeen: Map<number, Date>,
  socketRef: RefObject<Socket | null>,
  emitJoinRooms: (data: JoinRoomSocket) => void,
}

export interface Pagination {
  cursor?: Date | null,
  cursor_id?: number | null,
  offset: number,
  limit: number,
  hasMore: boolean
}

export enum RecipientType {
  RECENT,
  UNREAD,
  GROUP
}

export interface WithPagination<T> {
  nextCursor?: Date | null;
  nextOffset?: number | null;
  nextCursorId?: number | null;
  hasMore: boolean;
  data: T;
}

export const fileExtensions: Record<string, string> = {
  // video
  'mp4': 'video',
  'mkv': 'video',
  'avi': 'video',
  'mov': 'video',
  'wmv': 'video',
  'flv': 'video',
  'webm': 'video',

  // Image
  'jpg': 'image',
  'jpeg': 'image',
  'png': 'image',
  'gif': 'image',
  'bmp': 'image',
  'svg': 'image',
  'webp': 'image',
  'tiff': 'image',
  'ico': 'image',

  // Compressed
  'zip': 'compressed',
  'rar': 'compressed',
  '7z': 'compressed',
  'tar': 'compressed',
  'gz': 'compressed',
  'bz2': 'compressed',
  'xz': 'compressed',
  'iso': 'compressed',
  'x-zip-compressed': 'compressed',

  'unknown': 'other'
};

export const fileTypeToIcon: Record<string, IconDefinition> = {
  'image': faImage,
  'video': faVideo,
  'compressed': faFileZipper,
  'other': faFile
}

export interface GroupFields {
  name: string,
  members: Map<number, User>,
  avatar: string | null,
  avatarFile: File | null,
}

export const ModalTransparency = {
  HIGH: "bg-black/90",
  MEDIUM: "bg-black/50",
  LOW: "bg-black/20",
  VERY_LOW: "bg-black/10",
  NONE: ""
} as const;

export type ModalTransparency = keyof typeof ModalTransparency;

export enum MobileViewType {
  CONVERSATION,
  CHAT
}

export interface GifItemData {
  id: string;
  title: string;
  url: string;
  preview_url?: string;
  width?: number;
  height?: number;
  type?: string;
  source?: string;
}
