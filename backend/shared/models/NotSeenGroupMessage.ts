import { Group } from "./Group";
import { GroupMessage } from "./GroupMessage";
import { User } from "./User";

export interface NotSeenGroupMessage {
  id: number;
  group_id: number;
  to_id: number;
  count: number;
  message_id: number;

  group?: Group;
  to?: User;
  message?: GroupMessage | null,

  createdAt: Date;
  updatedAt: Date;
}
