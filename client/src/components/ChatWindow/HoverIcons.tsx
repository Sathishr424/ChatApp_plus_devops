import { useAuth } from "@/contexts/AuthContext";
import { useMesssagesContext } from "@/contexts/MessagesContext";
import { useSocketContext } from "@/contexts/SocketContext";
import type { Message } from "@/types/Message";
import { faPencil, faReply, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HoverIcons({ onHover, message }: { onHover: boolean, message: Message }) {
  const { user } = useAuth();
  const { emitDeleteMessage } = useSocketContext();
  const { setReply, setEdit } = useMesssagesContext();

  return onHover ? <div className={"absolute z-10 p-0.5 flex flex-row items-center border border-gray-300 bg-slate-200 text-black rounded -top-2 " + (message.from_id === user?.id ? "right-11/12" : "left-11/12")}>
    <button className="cursor-pointer hover:bg-slate-400 px-2 py-1 rounded" onClick={() => setReply(message)}>
      <FontAwesomeIcon title="Reply" className="text-sm" icon={faReply} />
    </button>

    {
      message.from_id == user?.id ?
        <button className="cursor-pointer hover:bg-slate-400 px-2 py-1 rounded" onClick={() => setEdit(message)}>
          <FontAwesomeIcon title="Edit" className="text-sm" icon={faPencil} />
        </button> : <></>
    }

    {
      message.from_id == user?.id ? <button onClick={() => emitDeleteMessage({
        is_group: message.is_group,
        message_id: message.id,
        to_id: message.is_group ? message.group_id! : message.to_id!,
        from_id: message.from_id,
      })} className="cursor-pointer hover:bg-slate-400 px-2 py-1 rounded">
        <FontAwesomeIcon title="Delete" className="text-sm" icon={faTrash} />
      </button> : <></>
    }
  </div> : <></>
}
