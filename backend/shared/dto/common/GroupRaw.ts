import { RecipientRaw } from "./RecipientRaw";

export interface GroupRaw extends RecipientRaw {
  name: string,
  avatar: string,
  members_count: number,
  updatedAt: Date,
  createdAt: Date,
}
