import useSocket from "@/hooks/useSocket";
import { SocketContext } from "./SocketContext";
import { Outlet } from "react-router-dom";

export default function SocketProvider() {
  const data = useSocket();

  return <SocketContext.Provider value={data}>
    <Outlet />
  </SocketContext.Provider>;
}
