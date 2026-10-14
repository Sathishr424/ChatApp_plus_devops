import { theme } from "@/config/theme";
import { useMesssagesContext } from "@/contexts/MessagesContext";
import ModalWrapper from "../Modal/ModalWrapper";
import ScrollBottom from "../ScrollBottom";
import TypingIndicator from "../TypingIndicator";
import UnreadIndicator from "../UnreadIndicator";
import MessageItem from "./MessageItem";
import SearchModal from "./SearchModal";

export default function MessageList() {
  const { messages, handleScroll, isLoading, containerRef } = useMesssagesContext();
  const { messagesSearchData } = useMesssagesContext();
  const { setSearchModalToggle, searchModalToggle } = messagesSearchData;

  return <div className="flex flex-col justify-end flex-1 overflow-auto relative">
    <ModalWrapper isModalOpen={searchModalToggle}>
      <SearchModal setIsModalOpen={setSearchModalToggle} />
    </ModalWrapper>
    <div className="absolute top-0 w-full flex justify-center items-center">
      {
        isLoading ?
          <div className={`w-6 h-6 border-4 ${theme.predefined.loading} rounded-full animate-spin my-2`} />
          : <></>
      }
    </div>
    {/* We are reversing the messages container here so that it will easier to load older messages */}
    <div onScroll={handleScroll} ref={containerRef} className="message-list overflow-x-hidden overflow-y-auto flex flex-col-reverse px-4">
      {messages.map(msg => <MessageItem key={msg.id} message={msg} />)}
    </div>
    <ScrollBottom />
    <TypingIndicator />
    <UnreadIndicator />
  </div>
}
