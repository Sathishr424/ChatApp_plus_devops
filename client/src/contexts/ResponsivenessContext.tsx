import type { MobileViewType } from "@/interfaces";
import { createContext, useContext } from "react";

interface ResponsivenessContextType {
  mobileView: MobileViewType;
  openChat: () => void,
  openUnread: () => void
  isSelectedRecipientOnVisibleScreen: () => boolean
}

export const ResponsivenessContext = createContext<ResponsivenessContextType | null>(null);

export function useResponsiveness() {
  const context = useContext(ResponsivenessContext);

  if (!context) {
    throw new Error("useResponsiveness must be used inside AuthProvider");
  }

  return context;
}
