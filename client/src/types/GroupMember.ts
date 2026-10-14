import type { Group } from "@/types/Group";
import type { User } from "@/types/User";

export interface GroupMember {
  id: number;
  group_id: number;
  admin: boolean;
  member_id: number;
  member?: User;
  group?: Group;
  createdAt: Date;
  updatedAt: Date;
}

