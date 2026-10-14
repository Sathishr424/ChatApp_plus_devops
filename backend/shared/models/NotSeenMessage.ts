import { Message } from "./Message"
import { User } from "./User";

export interface NotSeenMessage {
  id: number;
  from_id: number;
  to_id: number;
  count: number;
  message_id: number | null;

  from?: User;
  to?: User;
  message: Message | null,
}
