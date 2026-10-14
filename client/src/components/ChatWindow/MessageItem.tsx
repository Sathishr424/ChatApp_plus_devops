import { theme } from "@/config/theme";
import { useAuth } from "@/contexts/AuthContext";
import type { Message } from "@/types/Message";
import { fillRecipientDetailsOnUser, formatMessageBubbleDate, getStorageURL } from "@/utils/helper";
import { faCheck, faPencil } from "@fortawesome/free-solid-svg-icons";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons/faCheckDouble";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import FilePreviewMessage from "./FilePreviewMessage";
import HoverIcons from "./HoverIcons";
import ReplyMessage from "./ReplyMessage";
import RecipientInfoTriggerModal from "../Modal/RecipientInfoTriggerModal";

const GroupMessageMemberTag = ({ message }: { message: Message }) => {
  const { user } = useAuth();
  const member = fillRecipientDetailsOnUser(message.from!);
  if (!message.is_group || message.from_id === user?.id) return <></>

  return <div className={`pb-1 mb-1 min-w-[100px] max-w-fit`}>
    <RecipientInfoTriggerModal key={member.id} user={member}>
      <div
        className={`flex items-center gap-1 cursor-pointer transition-colors bg-slate-600 p-1 pr-2 rounded`}
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
          <p className={`truncate text-sm font-medium ${theme.colors.text_alt}`}>
            {member.username}
          </p>
        </div>
      </div>

    </RecipientInfoTriggerModal>
  </div>
}

const MessageContainer = ({ message, onHover }: { message: Message, onHover: boolean }) => {
  if (!message.deleted) {
    return <>
      <FilePreviewMessage message={message} />
      <HoverIcons onHover={onHover} message={message} />
      <p className="whitespace-pre-wrap">{message.message}</p>
    </>
  } else {
    return <>
      <p className={`${theme.colors.deleted}`}>Message Deleted</p>
    </>
  }
}

const MessageStatus = ({ message, hidden }: { message: Message, hidden: boolean }) => {
  const { user } = useAuth();

  return <div className={hidden ? `invisible h-4 flex flex-row items-center` : `absolute bottom-1 right-1 text-xs p-0.5 flex flex-row items-center ${theme.colors.muted_alt}`}>
    {
      message.edited ? <span className={`mr-1`}>
        <FontAwesomeIcon className="" icon={faPencil} />
      </span> : <></>
    }
    <p>{formatMessageBubbleDate(message.from_id === user?.id ? message.updatedAt : message.createdAt)}</p>
    {
      message.from_id === user?.id ? <div className="ml-1">
        <FontAwesomeIcon className="" icon={message.seen ? faCheckDouble : faCheck} />
      </div> : <></>
    }
  </div>
}

export default function MessageItem({ message }: { message: Message }) {
  const { user } = useAuth();
  const [onHover, setOnHover] = useState(false);

  return <>
    <div id={`message-${message.id}`} key={message.id} className={`w-full flex flex-col my-3 p-2 ${message.from_id == user?.id ? 'items-end' : 'items-start'}`} >
      <ReplyMessage message={message} />
      <div onMouseEnter={() => setOnHover(true)} onMouseLeave={() => setOnHover(false)} className={`message-item relative ${theme.colors.text_alt} rounded-b p-3 max-w-3/4 overflow-visible ${message.from_id === user?.id ? theme.message.sent : theme.message.received}`}>
        <GroupMessageMemberTag message={message} />

        <MessageContainer onHover={onHover} message={message} />
        <MessageStatus message={message} hidden={true} />
        <MessageStatus message={message} hidden={false} />
      </div>
    </div>
  </>
}
