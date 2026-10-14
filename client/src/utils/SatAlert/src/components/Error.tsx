import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ToastContainer from "./ToastContainer";

export default function Error({ message }: { message: string }) {
  return <ToastContainer message={message} icon={faXmark} text={"text-red-600"} bg={"bg-red-200"} />
}
