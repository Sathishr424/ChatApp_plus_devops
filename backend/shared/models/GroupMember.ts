import { Group } from "./Group";
import { User } from "./User";

export interface GroupMember {
  id: number,
  group_id: number,
  admin: boolean,
  member_id: number,
  member?: User,
  group?: Group,
  createdAt: Date,
  updatedAt: Date,
}
