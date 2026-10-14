import { File } from "./File";
import { GroupMember } from "./GroupMember";
import { NotSeenGroupMessage } from "./NotSeenGroupMessage";

export interface Group {
  id: number,
  name: string,
  members_count: number,
  members?: GroupMember[],
  notSeenGroupMessages?: NotSeenGroupMessage[],
  createdAt: Date,
  updatedAt: Date,
  avatar?: File | null;
}
