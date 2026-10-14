import { theme } from "@/config/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useMesssagesContext } from "@/contexts/MessagesContext";
import { useUsersContext } from "@/contexts/UsersContext";
import type { Message } from "@/types/Message";
import { shrinkMessage } from "@/utils/helper";
import { faPencil, faPaperclip, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ReplyMessage({ message }: { message: Message }) {
  const { user } = useAuth();
  const { selectedRecipient } = useUsersContext()
  const { scrollToMessage } = useMesssagesContext();

  const onReplyClick = async () => {
    if (selectedRecipient !== null && message.reply_id !== null && message.reply_id !== undefined) await scrollToMessage(selectedRecipient, message.reply_id);
  }

  return message.reply ? <div onClick={onReplyClick} className="cursor-pointer mb-1 mt-4 max-w-3/4">
    <div className="flex flex-col relative">
      <div className={`absolute z-10 ${message.from_id === user?.id ? "-top-4 right-2" : "-top-4 left-2"} w-fit rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 shadow-sm`}>
        <p>
          @{message.reply.from_id === user?.id ? "You" : message.reply.from?.username}
        </p>
      </div>
      <div className={`px-4 py-2 flex flex-row justify-between relative rounded ${user?.id === message.reply.from_id ? theme.message.sent : theme.message.received} text-white`}>
        {
          message.reply.deleted !== null && message.reply.deleted ?
            <p className="text-white/60">Message Deleted</p> :
            <p className={`${theme.colors.text_alt}`}>
              {message.reply.message.length === 0 && message.reply.files && message.reply.files.length > 0 ? <span className={`${theme.colors.muted_alt}`}>Attachments</span> : shrinkMessage(message.reply.message, 250)}
              {
                message.reply.edited ?
                  <span className={`ml-1`}>
                    <FontAwesomeIcon className="" icon={faPencil} />
                  </span> : <></>
              }
              {
                message.reply.files && message.reply.files?.length > 0 ?
                  <span className="ml-1">
                    <FontAwesomeIcon className="" icon={faPaperclip} />
                  </span> : <></>
              }
              {
                message.reply.gif && message.reply.gif.length > 0 ?
                  <span className="ml-1">
                    <FontAwesomeIcon className="" icon={faStickyNote} />
                  </span> : <></>
              }
            </p>
        }
      </div>
    </div>
  </div> : <></>
}
