import { useUsersContext } from "@/contexts/UsersContext";
import { MobileViewType, RecipientType } from "@/interfaces";
import { useState } from "react";
import CreateGroupModal from "../Group/CreateGroupModal";
import ModalWrapper from "../Modal/ModalWrapper";
import ChatFilters from "./ChatFilters";
import ConversationSearch from "./ConversationSearch";
import RecipientItems from "./RecipientItems";
import { theme } from "@/config/theme";
import { useResponsiveness } from "@/contexts/ResponsivenessContext";

export default function RecipientList() {
  const { currentTab } = useUsersContext();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const { mobileView } = useResponsiveness();

  return <div className={`flex-1 
  ${mobileView === MobileViewType.CHAT ? "hidden md:flex" : ""}
    h-full flex flex-col overflow-hidden`}>

    <ModalWrapper isModalOpen={isCreateModalOpen}>
      <CreateGroupModal isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen} />
    </ModalWrapper>

    <div className={`px-2 pt-2 flex flex-col ${theme.colors.border} border-b`}>
      <div className="flex flex-col">
        <ConversationSearch />
        <ChatFilters />
      </div>

      {/* TODO: Update this later */}
      {
        currentTab === RecipientType.GROUP ? <button onClick={() => setIsCreateModalOpen(true)} className={`m-2 ${theme.buttons.primary}`}>
          Create Group
        </button> : <></>
      }
    </div>

    <RecipientItems />
  </div>
}
