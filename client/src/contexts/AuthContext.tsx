import type { Recipient } from "@/types/Recipient";
import React, { createContext, useContext } from "react";

interface AuthContextType {
  user: Recipient | null;
  setUser: React.Dispatch<React.SetStateAction<Recipient | null>>
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
