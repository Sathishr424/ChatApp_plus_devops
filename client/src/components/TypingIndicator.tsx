import { theme } from "@/config/theme";
import { useMesssagesContext } from "@/contexts/MessagesContext";

export default function TypingIndicator() {
  const { isTyping } = useMesssagesContext();

  return <div className="absolute mx-4 my-2">
    {isTyping && (
      <div className={theme.typing.container}>
        <span className={theme.typing.text}>
          {isTyping.username} typing
        </span>

        <div className="flex items-center gap-0.5">
          <span className={theme.typing.dot} />
          <span className={theme.typing.dot} />
          <span className={theme.typing.dot} />
        </div>
      </div>
    )}
  </div>
}
