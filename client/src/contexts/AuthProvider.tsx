import type { User } from "@/types/User";
import type { Recipient } from "@/types/Recipient";
import JWTService from "@/services/JWTService";
import UserService from "@/services/UserService";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useSocketContext } from "./SocketContext";
import { fillRecipientDetailsOnUser } from "@/utils/helper";

export default function AuthProvider() {
  const [user, setUser] = useState<Recipient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { initializeSocket } = useSocketContext();

  useEffect(() => {
    const validateAuthentication = async () => {
      try {
        if (location.pathname === "/login" || location.pathname === "/register") {
          setIsLoading(false);
        } else if (user === null) {
          const data: User = await UserService.me();
          if (data !== null && data.email !== undefined) {
            setUser(fillRecipientDetailsOnUser(data));
            setIsLoading(false);
          } else {
            navigate("/login");
          }
        }
      } catch {
        navigate("/login");
      }
    }

    validateAuthentication();
  }, [location.pathname, navigate])

  useEffect(() => {
    if (user === null) return;
    const authToken = JWTService.getToken();
    return initializeSocket(user.id, authToken);
  }, [user, initializeSocket])

  return isLoading ? null : <AuthContext.Provider value={{ user, setUser }}>
    <Outlet />
  </AuthContext.Provider>;
}
