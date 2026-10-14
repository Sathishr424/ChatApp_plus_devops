import type { SocketProps } from "@/interfaces";
import { createContext, useContext } from "react";

export const SocketContext = createContext<SocketProps | null>(null);

export function useSocketContext() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocketContext must be used inside SocketProvider");
  }

  return context;
}
