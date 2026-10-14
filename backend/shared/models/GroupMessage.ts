import { Group } from "./Group";
import { MessageFile } from "./MessageFile";
import { User } from "./User";

export interface GroupMessage {
  id: number;
  from_id: number;
  group_id: number;
  deleted: boolean;
  edited: boolean;
  gif: string;
  from?: User;
  group?: Group;
  reply_id?: number | null;
  reply?: GroupMessage | null;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  files?: MessageFile[];
}
