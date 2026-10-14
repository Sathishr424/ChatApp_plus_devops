import { useSocketContext } from "@/contexts/SocketContext";
import { useUsersContext } from "@/contexts/UsersContext";
import type { GroupFields } from "@/interfaces";
import FileUploadService from "@/services/FileUploadService";
import GroupService from "@/services/GroupService";
import type { Group } from "@/types/Group";
import { type User } from "@/types/User";
import { fillRecipientDetailsOnGroup, handleAPIRequest } from "@/utils/helper";
import { SatToast, ToastType } from "@/utils/SatAlert";
import { useState, type SubmitEvent } from "react";
import GroupModal from "./GroupModal";

export default function CreateGroupModal({ isCreateModalOpen, setIsCreateModalOpen }: { isCreateModalOpen: boolean, setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { setUsers } = useUsersContext();
  const [fields, setFields] = useState<GroupFields>({
    name: "",
    members: new Map<number, User>,
    avatar: null,
    avatarFile: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const { emitGroupActivity } = useSocketContext();

  const createGroup = async () => {
    const response = await FileUploadService.uploadFiles(fields.avatarFile ? [fields.avatarFile] : []);

    const newGroup = await GroupService.createGroup({
      name: fields.name,
      members: Array.from(fields.members.keys()),
      ...(response.length > 0 ? { avatarFile: response[0] } : {})
    });

    return newGroup;
  }

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const newGroup: Group = await handleAPIRequest(async () => {
      return createGroup();
    }, setIsLoading);

    emitGroupActivity({ group_id: newGroup.id, members: newGroup.members.map(member => member.id) });
    setUsers(prev => [fillRecipientDetailsOnGroup(newGroup), ...prev]);
    SatToast.alert("Group created", ToastType.SUCCESS);

    setIsCreateModalOpen(false);
  }

  return <GroupModal isLoading={isLoading} isCreate={true} fields={fields} setFields={setFields} isModalOpen={isCreateModalOpen} setIsModalOpen={setIsCreateModalOpen} onSubmit={onSubmit} />
}
