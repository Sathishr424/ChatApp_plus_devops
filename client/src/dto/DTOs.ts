export interface LoginRequestDTO {
  email: string,
  password: string
}

export interface RegisterRequestDTO {
  email: string,
  username: string,
  password: string
}

export interface SentMessageDTO {
  message: string,
  reply_id?: number
}

export interface UserUpdateRequestDTO {
  fullname: string,
  avatarFile?: FileDTO
}

export interface GroupCreateRequestDTO {
  name: string,
  members: number[]
  avatarFile?: FileDTO
}

export interface GroupUpdateRequestDTO {
  name: string,
  members: number[]
  avatarFile?: FileDTO
}

export interface FileDTO {
  storedName: string,
  originalName: string,
  size: number,
  mimeType: string,
}

export interface SentMessageSocket {
  to_id: number;
  is_group: boolean,
  message: string;
  reply_id?: number;
  files?: FileDTO[];
  gif?: string;
}

export interface DeleteMessageSocket {
  message_id: number;
  to_id: number;
  from_id: number;
  is_group: boolean,
}

export interface MessagesSeenSocket {
  from_id: number;
  to_id: number;
  is_group: boolean,
}

export interface EditMessageSocket {
  message_id: number,
  to_id: number;
  is_group: boolean,
  message: string;
  reply_id?: number;
}

export interface JoinRoomSocket {
  ids: {
    id: number,
    is_group: boolean
  }[]
}

export interface TypingSocket {
  to_id: number;
  is_group: boolean,
}

export interface UploadResponse {
  storedName: string,
  originalName: string,
  size: number,
  mimeType: string,
}
