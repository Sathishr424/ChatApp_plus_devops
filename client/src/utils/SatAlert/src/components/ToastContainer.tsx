import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ToastContainer({
  message,
  bg,
  text,
  icon,
}: {
  message: string;
  bg: string;
  text: string;
  icon: IconDefinition;
}) {
  return (
    <div
      className={`
        mx-3 my-2 flex min-w-64 max-w-sm items-center gap-3
        rounded-xl border border-gray-200/80
        bg-white px-4 py-3
        shadow-lg shadow-gray-900/10
      `}
    >
      <div
        className={`
          flex h-9 w-9 shrink-0 items-center justify-center
          rounded-full ${bg}
        `}
      >
        <FontAwesomeIcon
          className={`text-sm ${text}`}
          icon={icon}
        />
      </div>

      <p className="text-sm font-medium leading-5 text-gray-700">
        {message}
      </p>
    </div>
  );
}
