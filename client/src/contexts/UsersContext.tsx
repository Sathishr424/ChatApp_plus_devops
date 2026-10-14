import type { UsersProps } from "@/interfaces";
import { createContext, useContext } from "react";

export const UsersContext = createContext<UsersProps | null>(null);

export function useUsersContext() {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error("useUsersContext must be used inside UsersProvider");
  }

  return context;
}
