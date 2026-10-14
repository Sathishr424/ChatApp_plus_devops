import type { MessagesProps } from "@/interfaces";
import { createContext, useContext } from "react";

export const MesssagesContext = createContext<MessagesProps | null>(null);

export function useMesssagesContext() {
  const context = useContext(MesssagesContext);

  if (!context) {
    throw new Error("useMesssagesContext must be used inside MesssagesProvider");
  }

  return context;
}
