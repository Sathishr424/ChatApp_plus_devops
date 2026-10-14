import Sidebar from "@/components/Sidebar";
import { theme } from "@/config/theme";
import { useResponsiveness } from "@/contexts/ResponsivenessContext";
import { MobileViewType } from "@/interfaces";
import MessagesTab from "../components/ChatWindow";

export default function Home() {
  const { mobileView } = useResponsiveness();

  return <div className={`w-screen md:w-screen max-w-screen h-screen flex flex-col items-center md:flex-row p-2 ${theme.colors.secondary}`}>
    <div className={`w-full max-w-200
      ${mobileView === MobileViewType.CONVERSATION ? "h-full" : ""}
      md:h-full
      md:w-auto ${theme.colors.background} border ${theme.colors.border}`}>
      <Sidebar />
    </div>
    <div className={`flex flex-1 w-full h-full overflow-auto
      ${mobileView === MobileViewType.CONVERSATION ? "hidden md:flex" : ""}
      ${theme.colors.background} border ${theme.colors.border}`}>
      <MessagesTab />
    </div>
  </div>
}
