import { theme } from "@/config/theme";
import { useSocketContext } from "@/contexts/SocketContext";
import type { Recipient } from "@/types/Recipient";
import { getStorageURL } from "@/utils/helper";

export default function OnlineIndicator({ user }: { user: Recipient | null }) {
  const { usersOnline } = useSocketContext();

  return user !== null ? <div className="relative w-13 h-13 overflow-visible">
    <div className={`overflow-hidden w-13 h-13 rounded-full flex flex-row justify-center items-center ${theme.profile.background}`}>
      {
        user?.avatar ? <img
          src={getStorageURL(user.avatar)}
          alt="Profile"
          className="h-full w-full object-cover"
        /> : <p className="font-bold text-xl text-white">{user?.name.slice(0, 2).toUpperCase()}</p>
      }
      {
        !user.is_group ? <div className={`absolute border right-0.5 bottom-0.5 w-3 h-3 rounded-full ${theme.profile.border} ${usersOnline.has(user.id) ? theme.profile.online : theme.profile.offline}`}></div> : <></>
      }
    </div>
  </div> : <></>
}
