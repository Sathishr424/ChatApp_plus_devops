import { Request } from "express";

export interface JwtPayload {
  userId: number,
  email: string,
  username: string
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface MessageFilter {
  id?: number;
  OR?: MessageFilter[];
  AND?: MessageFilter[];
  from_id?: number;
  to_id?: number;
  group_id?: number;
  message?: any;
}

export interface SentFile {
  originalName: string;
  storedName: string;
  size: number;
  mimeType: string;
}

export interface SentMessage {
  from_id: number;
  to_id: number;
  message: string;
  reply_id?: number;
  gif?: string;
}

export interface SentGroupMessage {
  from_id: number;
  group_id: number;
  message: string;
  reply_id?: number
  gif?: string;
}

export interface EditMessage {
  message_id: number;
  message: string;
}

export interface JoinRoomSocket {
  id: number,
  is_group: boolean
}
