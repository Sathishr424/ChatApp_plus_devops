import { useMessages } from "@/hooks/useMessages";
import { MesssagesContext } from "./MessagesContext";
import { Outlet } from "react-router-dom";

export default function MessagesProvider() {
  const data = useMessages();

  return <MesssagesContext.Provider value={data}>
    <Outlet />
  </MesssagesContext.Provider>;
}
