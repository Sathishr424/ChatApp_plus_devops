import { MessageFile } from "./MessageFile";
import { User } from "./User";

export interface Message {
  id: number;
  from_id: number;
  to_id: number;
  deleted: boolean;
  edited: boolean;
  seen: boolean;
  gif: string;
  from?: User;
  to?: User;
  reply_id?: number | null;
  reply?: Message | null;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  files?: MessageFile[];
}
