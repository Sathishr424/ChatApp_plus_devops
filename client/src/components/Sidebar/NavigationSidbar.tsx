import { theme } from "@/config/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useResponsiveness } from "@/contexts/ResponsivenessContext";
import { useUsersContext } from "@/contexts/UsersContext";
import { RecipientType } from "@/interfaces";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import OnlineIndicator from "../ChatWindow/OnlineIndicator";
import ModalWrapper from "../Modal/ModalWrapper";
import UserModal from "../Modal/UserModal";

export default function NavigationSidebar() {
  const { user } = useAuth();
  const { openUnread } = useResponsiveness();
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const { users, setCurrentTab } = useUsersContext();
  const [notifications, setNotifications] = useState<number>(0);

  useEffect(() => {
    let cnt = 0;
    users.forEach(usr => {
      if (usr.unread_count > 0) cnt += 1;
    })
    // eslint-disable-next-line
    setNotifications(cnt);
  }, [users])

  const handleUnreadClick = () => {
    setCurrentTab(RecipientType.UNREAD)
    openUnread();
  }

  return <div className={`md:h-full ${theme.colors.border} border-r p-1 flex flex-row md:flex-col justify-between`}>
    <ModalWrapper isModalOpen={isUserModalOpen}>
      <UserModal setIsModalOpen={setIsUserModalOpen} />
    </ModalWrapper>

    <div className="px-4 py-3">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:[writing-mode:vertical-rl]">
        Sat<span className="text-blue-500">Chat</span>
      </h1>
    </div>

    <div className="flex flex-row md:flex-col items-center">
      {/* Notification icon */}
      <div className={`mx-2 md:mx-0 md:my-2 flex justify-center items-center`}>
        <button onClick={() => handleUnreadClick()} className={`relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-200 hover:text-gray-900`}>
          <FontAwesomeIcon className={`text-2xl`} icon={faBell} />
          {
            notifications > 0 ? <div className="absolute top-0 left-0 shadow w-5 h-5 mb-1 bg-blue-500 text-white flex flex-row justify-center items-center rounded-full">
              <p className="text-xs">{notifications}</p>
            </div> : <></>
          }
        </button>
      </div>

      <button onClick={() => setIsUserModalOpen(true)} className="mx-2 md:mx-0 md:my-2 cursor-pointer">
        <OnlineIndicator user={user!} />
      </button>
    </div>
  </div>
}
