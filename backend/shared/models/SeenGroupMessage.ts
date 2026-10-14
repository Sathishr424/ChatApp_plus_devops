import { GroupMessage } from "./GroupMessage";
import { User } from "./User";

export interface GroupMessageSeen {
  id: number;
  user_id: number,
  message_id: number,

  user?: User;
  message: GroupMessage | null,

  createdAt: Date,
  updatedAt: Date,
}
