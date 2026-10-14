import { faInfo } from "@fortawesome/free-solid-svg-icons";
import ToastContainer from "./ToastContainer";

export default function Info({ message }: { message: string }) {
  return <ToastContainer message={message} icon={faInfo} text={"text-blue-600"} bg={"bg-blue-200"} />
}
