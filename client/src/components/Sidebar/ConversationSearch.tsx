import { theme } from "@/config/theme";
import { useUsersContext } from "@/contexts/UsersContext";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ConversationSearch() {
  const { resetSearch, searchUser, setSearchUser } = useUsersContext();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetSearch();
  }

  return <form className="flex flex-row w-full my-1" onSubmit={onSubmit}>
    <div className="w-full relative flex flex-row items-center ">
      <input placeholder="Search conversations..." className={`w-full rounded-lg py-2 pl-10 pr-2 ${theme.input.bg} ${theme.predefined.input}`} type="text" name="search" value={searchUser} onChange={(ev) => setSearchUser(ev.target.value)} />
      <span className="absolute left-3">
        <FontAwesomeIcon className={`text-base ${theme.colors.muted}`} icon={faSearch} />
      </span>
    </div>
  </form>
}
