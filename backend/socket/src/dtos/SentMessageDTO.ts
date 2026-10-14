export interface EditMessageDTO {
  message_id: number,
  to_id: number;
  is_group: boolean,
  message: string;
}

export interface MessagesSeenDTO {
  from_id: number,
  to_id: number;
  is_group: boolean,
}

export interface FileDTO {
  originalName: string;
  storedName: string;
  size: number;
  mimeType: string;
}

export interface SentMessageDTO {
  to_id: number;
  is_group: boolean,
  message: string;
  reply_id?: number;
  gif?: string;
  files?: FileDTO[];
}

export interface DeleteMessageDTO {
  to_id: number;
  from_id: number,
  is_group: boolean,
  message_id: number;
}
