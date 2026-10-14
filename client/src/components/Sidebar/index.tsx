import NavigationSidebar from "./NavigationSidbar";
import RecipientList from "./RecipientList";

export default function Sidebar() {

  return <div className={`h-full flex flex-col 
    md:flex-row`}>
    <NavigationSidebar />
    <RecipientList />
  </div>
}
