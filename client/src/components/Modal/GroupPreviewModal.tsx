import GroupService from "@/services/GroupService";
import type { Recipient } from "@/types/Recipient";
import { fillRecipientDetailsOnUser, getStorageURL } from "@/utils/helper";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import RecipientInfoTriggerModal from "./RecipientInfoTriggerModal";
import { theme } from "@/config/theme";

export default function GroupPreviewModal({ group, setIsModalOpen }: { group: Recipient, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [members, setMembers] = useState<Recipient[]>([]);

  useEffect(() => {
    // eslint-disable-next-line
    if (group?.avatar) setAvatar(getStorageURL(group.avatar));

    // TODO: Fix this one because server returns a different type then we expect
    const fetchGroup = async () => {
      const groupData = await GroupService.getGroup(group.id);
      setMembers(groupData.members.map(usr => fillRecipientDetailsOnUser(usr)));
    }

    fetchGroup()
  }, [group])

  return (
    <Modal transparency="MEDIUM" setIsModalOpen={setIsModalOpen}>
      <div className={`w-full max-w-lg rounded-lg ${theme.colors.background} shadow-lg`}>
        {/* Header */}
        <div className={`border-b ${theme.colors.border} px-5 py-4`}>
          <h2 className={`text-lg font-semibold ${theme.colors.text}`}>
            Group
          </h2>
          <p className={`mt-1 text-sm ${theme.colors.muted}`}>
            group information.
          </p>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          {/* Profile picture */}
          <div className="flex justify-center">
            <div
              className={`group relative ${theme.profile.background} h-28 w-28 flex justify-center items-center overflow-hidden rounded-full border-2 ${theme.colors.border}`}
            >
              {
                avatar !== null ? <img
                  src={avatar}
                  alt="Profile"
                  className="h-full w-full object-cover"
                /> : <p className={`font-bold text-xl text-white`}>{group?.name.slice(0, 2).toUpperCase()}</p>
              }
            </div>
          </div>

          {/* Group information */}
          <div className="mt-6 space-y-4">
            <div>
              <p className={`text-xs font-medium uppercase tracking-wide ${theme.colors.muted}`}>
                Group Name
              </p>
              <p className={`mt-1 text-sm ${theme.colors.text}`}>
                {group?.name ?? "-"}
              </p>
            </div>

            <div>
              <p className={`text-xs font-medium uppercase tracking-wide ${theme.colors.muted}`}>
                Joined
              </p>
              <p className={`mt-1 text-sm ${theme.colors.text}`}>
                {group?.createdAt
                  ? new Date(group.createdAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>


          {/* Members information */}
          <div className="mt-6">
            <div className={`mb-3 flex items-center justify-between`}>
              <p className={`text-xs font-medium uppercase tracking-wide ${theme.colors.muted}`}>
                Members
              </p>

              <span className={`rounded-full ${theme.colors.border} px-2.5 py-1 text-xs font-medium ${theme.colors.muted}`}>
                {members.length}
              </span>
            </div>

            <div className={`max-h-[280px] space-y-1.5 overflow-y-auto rounded-lg border ${theme.colors.border}`}>
              {members.map((member) => (
                <RecipientInfoTriggerModal key={member.id} user={member}>
                  <div
                    className={`flex items-center gap-3 cursor-pointer px-2 py-2 transition-colors hover:${theme.colors.secondary}`}
                  >
                    {/* Avatar */}
                    {member.avatar ? (
                      <img
                        src={getStorageURL(member.avatar)}
                        alt={member.name}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${theme.profile.background} text-sm font-semibold ${theme.colors.text_alt}`}>
                        {member.username?.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    {/* Member info */}
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-medium ${theme.colors.text}`}>
                        {member.username}
                      </p>
                    </div>
                  </div>

                </RecipientInfoTriggerModal>

              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-2 border-t ${theme.colors.border} px-5 py-3`}>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className={`${theme.buttons.secondary_alt}`}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
