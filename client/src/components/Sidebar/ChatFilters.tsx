import { theme } from "@/config/theme";
import { useUsersContext } from "@/contexts/UsersContext";
import { RecipientType } from "@/interfaces";

export default function ChatFilters() {
  const { currentTab, setCurrentTab } = useUsersContext();
  const filters = [
    {
      id: 1,
      name: "Recent",
      type: RecipientType.RECENT
    },
    {
      id: 2,
      name: "Unread",
      type: RecipientType.UNREAD
    },
    {
      id: 3,
      name: "Groups",
      type: RecipientType.GROUP
    },
  ];

  return <div className={`${theme.colors.text} w-full flex flex-row mt-2`}>
    {
      filters.map(filter => {
        return <div onClick={() => setCurrentTab(filter.type)} key={filter.id} className={`cursor-pointer flex flex-1 flex-col justify-center items-center pt-1 rounded-t hover:${theme.colors.secondary}`}>
          <p className={`mb-1 ${theme.colors.muted}`}>{filter.name}</p>
          {
            filter.type === currentTab ? <div className={`${theme.colors.highlight} h-[3.5px] w-3/4 rounded-t`}></div> : <></>
          }
        </div>
      })
    }
  </div>
}
