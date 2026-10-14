import { theme } from "@/config/theme";
import { useAuth } from "@/contexts/AuthContext";
import { fileExtensions, fileTypeToIcon } from "@/interfaces";
import type { File } from "@/types/File";
import type { Message } from "@/types/Message";
import { downloadFile, getStorageURL } from "@/utils/helper";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FilePreviewMessage({ message }: { message: Message }) {
  const { user } = useAuth();

  const downloadButton = (file: File) => {
    return (
      <button onClick={(event) => { event.stopPropagation(); downloadFile(file); }} aria-label="Download file" className=" absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center text-white rounded-full bg-black/60 border border-white/20 shadow-lg backdrop-blur-sm cursor-pointer transition-all duration-200 hover:bg-black/80 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 " >
        <FontAwesomeIcon icon={faDownload} className="text-sm" />
      </button>
    );
  };


  if ((!message.gif || message.gif.length === 0) && (!message.files || message.files.length === 0)) return null;

  return (
    <div
      className={`flex flex-row items-end rounded-t p-2 
          w-full overflow-x-auto overflow-y-hidden
          [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:m-2
          [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-primary
          [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 
          ${message.from_id == user?.id ? theme.message.sent : theme.message.received}`}
    >
      {
        message.gif && message.gif.length > 0 ? <div key={message.gif} className={`mx-1 relative`}>
          <div className={`w-48 border ${theme.colors.border} shadow flex justify-center items-center overflow-hidden rounded`}>
            <img src={message.gif} alt="" className='block w-full h-auto' />
          </div>
        </div> : <></>
      }
      {
        message.files && message.files.length > 0 ? message.files.map((file, index) => {
          const file_extension = file.mimeType.split("/").pop() ?? "other";
          const file_type = fileExtensions[file_extension];
          const icon = fileTypeToIcon[file_type] !== undefined ? fileTypeToIcon[file_type] : fileTypeToIcon.other;

          return file_type === "image" ? (
            // Added mr-2 for spacing between items instead of m-1 to keep alignment clean
            <div key={index} className="relative mx-1">
              <div className="flex items-center">
                <div className="border-2 rounded shadow-md overflow-hidden h-48 w-48 bg-secondaryBackground relative">
                  <img src={getStorageURL(file.storedName)} alt="" className="object-cover w-full h-full" />
                </div>
              </div>
              {downloadButton(file)}
            </div>
          ) : (
            <div key={index} className="relative text-white mx-1">
              {/* Defined a strict width (w-64) so it never stretches arbitrarily */}
              <div className={`h-24 w-64 border shadow flex items-center overflow-hidden rounded p-2`}>
                <FontAwesomeIcon className={`p-3 rounded-md mr-2`} size="2x" icon={icon} />

                {/* 2. min-w-0 flex-1: Required for text truncation inside a flex row */}
                <div className="flex flex-col min-w-0 flex-1 pr-8">
                  <p className="text-sm truncate w-full" title={file.storedName}>
                    {file.storedName}
                  </p>
                  <p className="text-xs mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              {downloadButton(file)}
            </div>
          );
        }) : <></>
      }
    </div>
  );
}
