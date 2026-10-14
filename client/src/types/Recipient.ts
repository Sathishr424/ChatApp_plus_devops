import type { User } from "./User";

export interface Recipient {
  id: number;
  unread_count: number;
  last_message: string | null;
  last_updated: Date | null;
  last_message_id: number | null;
  last_message_deleted: boolean | null;
  last_message_edited: boolean | null;
  last_message_gif: string | null;
  last_message_attachments: number;
  is_group: boolean;
  fullname?: string | null;
  username?: string;
  members?: User[];
  members_count?: number;
  last_seen?: Date,
  email?: string;
  name: string;
  avatar: string | null;
  createdAt: Date;
}

