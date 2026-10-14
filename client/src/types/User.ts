export interface User {
  id: number;
  fullname: string | null,
  is_group: boolean;
  unread_count: number;
  last_message: string | null;
  last_message_id: number | null;
  last_message_deleted: boolean | null;
  last_message_edited: boolean | null;
  last_message_gif: string | null;
  last_message_attachments: number;
  last_updated: Date | null;
  email: string;
  username: string;
  last_seen: Date;
  avatar: string | null;
  createdAt: Date;
}

