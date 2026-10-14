import type { Group } from "@/types/Group";
import type { User } from "@/types/User";
import type { File } from "./File";


export interface Message {
  id: number;
  is_group: boolean;
  from_id: number;
  to_id?: number;
  group_id?: number;
  deleted: boolean;
  edited: boolean;
  gif: string;
  seen: boolean;
  reply_id?: number | null;
  from?: User;
  to?: User;
  group?: Group;
  reply?: Message | null;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  files?: File[]
}

