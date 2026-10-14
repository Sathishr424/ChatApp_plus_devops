import { faCheck } from "@fortawesome/free-solid-svg-icons";
import ToastContainer from "./ToastContainer";

export default function Success({ message }: { message: string }) {
  return <ToastContainer message={message} icon={faCheck} text={"text-green-600"} bg={"bg-greeen-200"} />
}
