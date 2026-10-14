import { useAuth } from "@/contexts/AuthContext";
import { useUsersContext } from "@/contexts/UsersContext";
import UserCard from "../UserCard";
import { theme } from "@/config/theme";

export default function RecipientItems() {
  const { user } = useAuth();
  const { isLoading, handleScroll, users } = useUsersContext();

  return (
    <div onScroll={handleScroll} className="px-2 flex-1 min-h-0 overflow-y-auto">
      {
        users.map(us => {
          return us.is_group || us.id != user?.id ? <UserCard user={us} key={`${us.id}-${us.is_group}`} /> : null;
        })
      }
      <div className="w-full flex items-center justify-center">
        {
          isLoading ?
            <div className={`w-6 h-6 border-4 rounded-full animate-spin my-2 ${theme.predefined.loading}`} />
            : <></>
        }
      </div>
    </div>
  )
}
