import { File } from "./File";
import { GroupMessage } from "./GroupMessage";
import { Message } from "./Message";

export interface MessageFile {
  id: number,
  message_id: number,
  file_id: string,
  message?: Message | GroupMessage,
  file: File
}
