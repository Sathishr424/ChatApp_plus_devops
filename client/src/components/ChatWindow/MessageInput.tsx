import { theme } from "@/config/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useMesssagesContext } from "@/contexts/MessagesContext";
import { useSocketContext } from "@/contexts/SocketContext";
import { useUsersContext } from "@/contexts/UsersContext";
import type { EditMessageSocket, SentMessageSocket, UploadResponse } from "@/dto/DTOs";
import FileUploadService from "@/services/FileUploadService";
import { handleAPIRequest, shrinkMessage } from "@/utils/helper";
import { faPaperclip, faPaperPlane, faPen, faPencil, faReply, faStickyNote, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import { FilesPreview } from "./FilesPreview";

export default function MessageInput({ setGIFSelectorOpen }: { setGIFSelectorOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { selectedRecipient } = useUsersContext();
  const { emitEditMessage, emitTyping, emitSendMessage } = useSocketContext();
  const { GIF, setGIF, edit, setEdit, reply, setReply } = useMesssagesContext();
  const [files, setFiles] = useState<File[]>([]);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsloading] = useState(false);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);

    const imageFiles = items
      .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null);

    if (imageFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...imageFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const droppedFiles: File[] = Array.from(e.dataTransfer.files);

    if (droppedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    }
  };

  const refreshInputArea = () => {
    const textarea = messageInputRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }

  const reset = () => {
    setFiles([]);
    setEdit(null);
    setReply(null);
    setMessage("");
    setGIF(null);
    setTimeout(() => {
      refreshInputArea();
    }, 100)
  }

  useEffect(() => {
    // eslint-disable-next-line
    if (edit !== null) setMessage(edit.message);
    else setMessage("");
    setTimeout(() => {
      refreshInputArea();
    }, 100)
  }, [edit])

  useEffect(() => {
    // eslint-disable-next-line
    reset();
    // eslint-disable-next-line
  }, [selectedRecipient])

  const handleMessageChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(ev.target.value);

    refreshInputArea();

    if (selectedRecipient) emitTyping({
      to_id: selectedRecipient.id,
      is_group: selectedRecipient.is_group
    });
  }


  const sentMessage = async () => {
    if ((message.length === 0 && files.length === 0 && GIF === null) || isLoading) return;

    const response: UploadResponse[] = await handleAPIRequest(async () => {
      return await FileUploadService.uploadFiles(files);
    }, setIsloading);

    if (edit !== null) {
      emitEditMessage({
        message_id: edit.id,
        to_id: selectedRecipient?.id,
        is_group: selectedRecipient?.is_group,
        message: message,
        ...(reply !== null ? { reply_id: reply.id } : {})
      } as EditMessageSocket);
    } else {
      emitSendMessage({
        is_group: selectedRecipient?.is_group,
        message: message,
        to_id: selectedRecipient?.id,
        files: response,
        ...(GIF !== null ? { gif: GIF.url } : {}),
        ...(reply !== null ? { reply_id: reply.id } : {})
      } as SentMessageSocket);
    }

    reset();
  }

  useEffect(() => {
    // eslint-disable-next-line
    if (GIF !== null) sentMessage();
  }, [GIF])

  const sentMessageEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sentMessage();
  }

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFiles(Array.from(event.target.files));
  }

  return (
    <div className="p-2">
      <div className={`flex flex-col rounded-2xl bg-gray-100 border ${theme.colors.border} ${isDragging ? "ring-2 ring-blue-500 bg-blue-500/10" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FilesPreview files={files} setFiles={setFiles} />
        {reply !== null && (
          <div className="mx-4 mt-3 max-w-3/4">
            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm">

              {/* Reply indicator */}
              <div className="flex items-center justify-between border-b border-gray-200 px-3 py-1.5">
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={faReply}
                    className="text-xs text-blue-500"
                  />

                  <span className="text-xs font-semibold text-blue-600">
                    Replying to {reply.from_id === user?.id ? "You" : reply.from?.username}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setReply(null)}
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full
                     text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-sm" />
                </button>
              </div>

              {/* Message preview */}
              <div className="border-l-4 border-blue-500 px-3 py-2">
                {/* TODO: Later component this block, we been using this in multipl places */}
                {
                  reply.deleted !== null && reply.deleted ?
                    <p className="text-white/60 text-sm">Message Deleted</p> :
                    <p className={`${theme.colors.muted} text-sm`}>
                      {reply.message.length === 0 && reply.files && reply.files.length > 0 ? <span className={`${theme.colors.muted}`}>Attachments</span> : shrinkMessage(reply.message, 250)}
                      {
                        reply.edited ?
                          <span className={`ml-1`}>
                            <FontAwesomeIcon className="" icon={faPencil} />
                          </span> : <></>
                      }
                      {
                        reply.files && reply.files?.length > 0 ?
                          <span className="ml-1">
                            <FontAwesomeIcon className="" icon={faPaperclip} />
                          </span> : <></>
                      }
                      {
                        reply.gif && reply.gif.length > 0 ?
                          <span className="ml-1">
                            <FontAwesomeIcon className="" icon={faStickyNote} />
                          </span> : <></>
                      }
                    </p>
                }
              </div>
            </div>
          </div>
        )}
        {
          edit !== null ? <div className="max-w-3/4">
            <div className="ml-4 mt-2 flex items-center gap-2 text-xs text-gray-500">
              <FontAwesomeIcon icon={faPen} />
              <span>Editing message</span>

              <button
                onClick={() => setEdit(null)}
                className="cursor-pointer font-medium text-gray-500 underline underline-offset-2 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div> : <></>
        }
        <form onSubmit={sentMessageEvent} className="flex flex-row items-center py-2 px-4">
          <div className="mr-1">
            <button
              onClick={() => setGIFSelectorOpen(prev => !prev)}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
            >
              <FontAwesomeIcon
                title="Attach files"
                icon={faStickyNote}
                className="text-lg"
              />
            </button>
          </div>
          <div className="mr-2">
            <label
              htmlFor="files-upload"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
            >
              <FontAwesomeIcon
                title="Attach files"
                icon={faPaperclip}
                className="text-lg"
              />
            </label>
            <input onChange={handleFileUpload} hidden type="file" id="files-upload" name="files-upload" multiple />
          </div>

          <div className={`w-full flex justify-center items-center relative rounded-lg`}>
            <textarea
              onPaste={handlePaste}
              ref={messageInputRef}
              placeholder="Type a message..."
              className={`w-full resize-none overflow-y-auto rounded-lg px-2 py-2 ${theme.input.bg_2} ${theme.predefined.input}`}
              name="message"
              value={message}
              onChange={handleMessageChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              rows={1}
            />
          </div>

          <button disabled={isLoading} className="ml-2 flex w-11 h-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition hover:bg-blue-600 hover:shadow-md" type="submit">
            {
              isLoading ? <div className={`w-6 h-6 border-4 rounded-full animate-spin my-2 ${theme.predefined.loading}`} /> :
                <FontAwesomeIcon
                  title={edit !== null ? "Edit" : "Send"}
                  icon={edit !== null ? faPen : faPaperPlane}
                />
            }
          </button>
        </form>
      </div>

    </div>

  )
}
