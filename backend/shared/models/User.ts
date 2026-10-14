import { File } from "./File";
import { NotSeenMessage } from "./NotSeenMessage";

export interface User {
  id: number;
  email: string;
  username: string | null;
  fullname: string | null;
  password: string;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
  notSeenMessagesSent?: NotSeenMessage[];
  avatar?: File | null;
}
