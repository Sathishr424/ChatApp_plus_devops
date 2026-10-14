import { RecipientRaw } from "./RecipientRaw";

export interface UserRaw extends RecipientRaw {
  email: string,
  username: string,
  fullname: string,
  avatar: string,
  createdAt: Date,
  updatedAt: Date,
  lastSeen: Date,
}
