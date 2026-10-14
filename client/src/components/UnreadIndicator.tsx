import { theme } from "@/config/theme";
import { useMesssagesContext } from "@/contexts/MessagesContext";
import { scrollToElementBottom } from "@/utils/helper";

export default function UnreadIndicator() {
  const { unread, containerRef } = useMesssagesContext();

  return <div className="absolute right-10 px-4">
    {unread > 0 && (
      <button
        onClick={() => scrollToElementBottom(containerRef.current)}
        className={theme.newMessages.container}
      >
        <span className={theme.newMessages.text}>
          {unread} new {unread === 1 ? "message" : "messages"}
        </span>
      </button>
    )}
  </div>
}
