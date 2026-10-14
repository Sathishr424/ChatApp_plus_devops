import { useUsersContext } from "@/contexts/UsersContext";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import MessageHeader from "./MessagesHeader";
import GifPicker from "../GIFs/GIFPicker";
import { useState } from "react";

export default function MessagesTab() {
  const { selectedRecipient } = useUsersContext();
  const [GIFSelectorOpen, setGIFSelectorOpen] = useState<boolean>(false);

  return selectedRecipient !== null ? <div className="flex w-full flex-col h-full min-w-0">
    <MessageHeader />
    <MessageList />
    <div className="flex flex-col min-h-0 overflow-hidden">
      <MessageInput setGIFSelectorOpen={setGIFSelectorOpen} />
      <GifPicker GIFSelectorOpen={GIFSelectorOpen} />
    </div>
  </div> : <></>
}
