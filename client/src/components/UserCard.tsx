import { useUsersContext } from "@/contexts/UsersContext";
import type { Recipient } from "@/types/Recipient";
import { formatMessageDate, shrinkMessage } from "@/utils/helper";
import { faPaperclip, faPencil, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OnlineIndicator from "@/components/ChatWindow/OnlineIndicator";
import { theme } from "@/config/theme";
import { useResponsiveness } from "@/contexts/ResponsivenessContext";
import { useMesssagesContext } from "@/contexts/MessagesContext";

export default function UserCard({ user }: { user: Recipient }) {
  const { selectedRecipient, setSelectedRecipient } = useUsersContext();
  const { isLoading } = useMesssagesContext();
  const { openChat, isSelectedRecipientOnVisibleScreen } = useResponsiveness();

  const handleRecipientClick = (user: Recipient) => {
    if (isLoading) return;
    setSelectedRecipient(user)
    openChat();
  }

  return <div onClick={() => handleRecipientClick(user)} className={`cursor-pointer py-3 ${theme.colors.border_light} px-2 border-b flex flex-row items-stretch justify-start hover:${theme.colors.secondary} ${selectedRecipient?.is_group === user.is_group && selectedRecipient?.id === user.id && isSelectedRecipientOnVisibleScreen() ? theme.colors.selected : ""}`}>
    <OnlineIndicator user={user} />

    <div className="ml-2 flex flex-row items-stretch justify-between flex-1">
      <div className="mr-1 flex flex-col justify-between">
        <p className={`font-semibold mt-1 break-all ${theme.colors.text}`}>{user.name}</p>
        {user.last_message != null ?
          user.last_message_deleted !== null && user.last_message_deleted ?
            <p className="text-black/60 text-sm">Message Deleted</p> :
            <p className={`${theme.colors.muted} text-sm`}>
              {user.last_message.length === 0 && user.last_message_attachments > 0 ? <span className={`${theme.colors.muted}`}>Attachments</span> : shrinkMessage(user.last_message)}
              {
                user.last_message_edited ?
                  <span className={`ml-1`}>
                    <FontAwesomeIcon className="" icon={faPencil} />
                  </span> : <></>
              }
              {
                user.last_message_attachments > 0 ?
                  <span className="ml-1">
                    <FontAwesomeIcon className="" icon={faPaperclip} />
                  </span> : <></>
              }
              {
                user.last_message_gif && user.last_message_gif.length > 0 ?
                  <span className="ml-1">
                    <FontAwesomeIcon className="" icon={faStickyNote} />
                  </span> : <></>
              }
            </p>
          : ""}
      </div>
      <div className="flex flex-col justify-between items-end">
        <p className={`text-xs text-nowrap mt-1.5 ${theme.colors.muted}`}>{formatMessageDate(user.last_updated)}</p>
        <div>
          {
            user.unread_count > 0 ? <div className="w-5 h-5 mb-1 bg-blue-500 text-white flex flex-row justify-center items-center rounded-full">
              <p className="text-xs">{user.unread_count}</p>
            </div> : <></>
          }
        </div>
      </div>
    </div>
  </div>
}
