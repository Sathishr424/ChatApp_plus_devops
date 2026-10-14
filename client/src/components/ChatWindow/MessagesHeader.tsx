import { useMesssagesContext } from "@/contexts/MessagesContext";
import { useUsersContext } from "@/contexts/UsersContext";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import EditGroupModal from "../Group/EditGroupModal";
import OnlineIndicator from "./OnlineIndicator";
import ModalWrapper from "../Modal/ModalWrapper";
import RecipientInfoTriggerModal from "../Modal/RecipientInfoTriggerModal";
import { theme } from "@/config/theme";
import { formatMessageBubbleDate } from "@/utils/helper";
import { useSocketContext } from "@/contexts/SocketContext";

export default function MessageHeader() {
  const { selectedRecipient } = useUsersContext();
  const { messagesSearchData } = useMesssagesContext();
  const { setSearchModalToggle } = messagesSearchData;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { usersOnline, usersLastSeen } = useSocketContext();

  return selectedRecipient !== null ? <div className={`w-full px-4 py-2 flex felx-row justify-between items-center ${theme.colors.border} border-b`}>
    <ModalWrapper isModalOpen={isEditModalOpen}>
      <EditGroupModal isEditModalOpen={isEditModalOpen} group={selectedRecipient} setIsEditModalOpen={setIsEditModalOpen} />
    </ModalWrapper>

    <RecipientInfoTriggerModal user={selectedRecipient}>
      <div className="cursor-pointer flex flex-row items-center justify-center">
        <OnlineIndicator user={selectedRecipient} />
        <div className="mx-4 flex flex-col">
          <p className={`font-semibold mt-1 break-all ${theme.colors.text}`}>{selectedRecipient.name}</p>

          <div className={`flex flex-row ${theme.colors.muted} text-sm`}>
            {
              selectedRecipient.is_group ?
                <p>{(selectedRecipient.members_count ?? -1) + 1} members</p> :
                <p>{!selectedRecipient.is_group && usersOnline.has(selectedRecipient.id) ? "Online" : "Last seen: " + formatMessageBubbleDate(usersLastSeen.get(selectedRecipient.id) ?? selectedRecipient.last_seen ?? null)}</p>
            }
          </div>

        </div>
      </div>
    </RecipientInfoTriggerModal>

    <div className="flex flex-row items-center">
      {
        selectedRecipient.is_group ? <button className={`cursor-pointer mx-2 hover:${theme.colors.muted}`} type="button" onClick={() => setIsEditModalOpen(true)}>
          <FontAwesomeIcon className={`text-2xl ${theme.colors.text}`} icon={faPencil} />
        </button> : <></>
      }
      <button type="button" onClick={() => setSearchModalToggle(true)} className={`cursor-pointer mx-2 hover:${theme.colors.muted}`}>
        <FontAwesomeIcon className={`text-2xl ${theme.colors.text}`} icon={faSearch} />
      </button>
    </div>
  </div> : <></>
}
