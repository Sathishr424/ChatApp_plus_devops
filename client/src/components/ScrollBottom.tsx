import { theme } from "@/config/theme";
import { useMesssagesContext } from "@/contexts/MessagesContext";
import { scrollToElementTop } from "@/utils/helper";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ScrollBottom() {
  const { showScrollBottom, containerRef } = useMesssagesContext();
  if (!showScrollBottom) return <></>

  return <div className="absolute bottom-2 right-10 px-4">
    <button
      onClick={() => scrollToElementTop(containerRef.current)}
      className={`h-10 w-10 p-2 shadow-2xl border ${theme.colors.border} ${theme.colors.background} flex items-center justify-center rounded-full cursor-pointer hover:opacity-90`}
    >
      <FontAwesomeIcon size='1x' icon={faChevronDown} />
    </button>
  </div>
}
