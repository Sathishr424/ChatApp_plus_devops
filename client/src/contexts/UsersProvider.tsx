import { useUsers } from "@/hooks/useUsers";
import { UsersContext } from "./UsersContext";
import { Outlet } from "react-router-dom";

export default function UsersProvider() {
  const data = useUsers();

  return <UsersContext.Provider value={data}>
    <Outlet />
  </UsersContext.Provider>;
}
