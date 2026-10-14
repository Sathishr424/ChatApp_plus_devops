import { useSocketContext } from "@/contexts/SocketContext";
import { useUsersContext } from "@/contexts/UsersContext";
import GroupService from "@/services/GroupService";
import { type Recipient } from "@/types/Recipient";
import { type User } from "@/types/User";
import { fillRecipientDetailsOnGroup, handleAPIRequest } from "@/utils/helper";
import { SatToast, ToastType } from "@/utils/SatAlert";
import React, { useEffect, useState, type SubmitEvent } from "react";
import GroupModal from "./GroupModal";
import type { GroupFields } from "@/interfaces";
import type { UploadResponse } from "@/dto/DTOs";
import FileUploadService from "@/services/FileUploadService";
import type { Group } from "@/types/Group";

export default function EditGroupModal({ isEditModalOpen, setIsEditModalOpen, group }: { isEditModalOpen: boolean, setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>, group: Recipient }) {
  const { setUsers, setSelectedRecipient } = useUsersContext();
  const [fields, setFields] = useState<GroupFields>({
    name: "",
    members: new Map<number, User>,
    avatar: group.avatar,
    avatarFile: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { emitGroupActivity } = useSocketContext();

  useEffect(() => {
    // TODO: Fix this one because server returns a different type then we expect
    const fetchGroup = async () => {
      const groupData = await GroupService.getGroup(group.id);
      const members = new Map<number, User>;

      groupData.members.forEach(member => {
        members.set(member.id, member);
      });

      setFields({
        name: groupData.name,
        members,
        avatar: groupData.avatar,
        avatarFile: null
      });
    }

    handleAPIRequest(async () => {
      await fetchGroup()
    }, setIsLoading);
  }, [group])

  const updateGroup = async () => {
    const response: UploadResponse[] = await FileUploadService.uploadFiles(fields.avatarFile ? [fields.avatarFile] : []);
    const updatedGroup = await GroupService.updateGroup(group.id, {
      name: fields.name,
      members: Array.from(fields.members.keys()),
      ...(response.length > 0 ? { avatarFile: response[0] } : {})
    });

    return updatedGroup;
  }

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const updatedGroup: Group = await handleAPIRequest(async () => {
      return await updateGroup();
    }, setIsLoading);

    setUsers(prev => {
      return prev.map(recipient => {
        if (!recipient.is_group || recipient.id != updatedGroup.id) return recipient;
        return fillRecipientDetailsOnGroup(updatedGroup);
      })
    });

    emitGroupActivity({ group_id: updatedGroup.id, members: updatedGroup.members.map(member => member.id) });
    setSelectedRecipient(fillRecipientDetailsOnGroup(updatedGroup));
    SatToast.alert("Group Editd", ToastType.SUCCESS);
  }

  return <GroupModal isLoading={isLoading} isCreate={false} fields={fields} setFields={setFields} isModalOpen={isEditModalOpen} setIsModalOpen={setIsEditModalOpen} onSubmit={onSubmit} />
}
