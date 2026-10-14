import { theme } from "@/config/theme";
import { useMesssagesContext } from "@/contexts/MessagesContext";
import { fileExtensions, fileTypeToIcon } from "@/interfaces";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type MouseEvent } from "react";

export function FilesPreview({ files, setFiles }: { files: File[], setFiles: React.Dispatch<React.SetStateAction<File[]>> }) {
  const { GIF, setGIF } = useMesssagesContext();

  const handleFileDelete = (_: MouseEvent<HTMLElement>, index: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index))
  }

  const deleteButton = (index: number) => {
    return <button
      type="button"
      onClick={(event) => handleFileDelete(event, index)}
      className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-full absolute -top-1 -right-1
                     text-gray-100 transition bg-blue-400 shadow-lg  hover:bg-gray-200 hover:text-gray-700`}
    >
      <FontAwesomeIcon icon={faXmark} className="text-xs" />
    </button>
  }

  const deleteGIFButton = () => {
    return <button
      type="button"
      onClick={() => setGIF(null)}
      className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-full absolute -top-1 -right-1
                     text-gray-100 transition bg-blue-400 shadow-lg  hover:bg-gray-200 hover:text-gray-700`}
    >
      <FontAwesomeIcon icon={faXmark} className="text-xs" />
    </button>
  }

  if (GIF === null && (!files || files.length === 0)) return null;

  return (
    <div className="flex flex-row items-center overflow-auto mx-4 mt-2">
      {
        GIF !== null ? <div key={GIF.id} className={`m-1 mx-2 relative`}>
          <div className={`w-30 border ${theme.colors.border} shadow flex justify-center items-center overflow-hidden rounded`}>
            <img src={GIF.url} alt="" className='block w-full h-auto' />
          </div>
          {
            deleteGIFButton()
          }
        </div> : <></>
      }
      {
        files.map((file, index) => {
          const file_extension: string = file.type.split("/").pop() ?? "other";
          const file_type = fileExtensions[file_extension];
          const icon = fileTypeToIcon[file_type] !== undefined ? fileTypeToIcon[file_type] : fileTypeToIcon.other;
          const preview = URL.createObjectURL(file);

          return file_type === 'image' ? <div key={index} className={`m-1 mx-2 relative`}>
            <div className={`w-20 h-20 border ${theme.colors.border} shadow flex justify-center items-center overflow-hidden rounded`}>
              <img src={preview} alt="" className='object-cover' />
            </div>
            {
              deleteButton(index)
            }
          </div> : <div key={index} className="m-1 mx-2 relative">
            <div className={`h-20 min-w-[150px] border ${theme.colors.border} shadow bg-white flex items-center overflow-hidden rounded p-2`}>
              <FontAwesomeIcon size='2x' icon={icon} />
              <div className="flex flex-col ml-2">
                <p className='font-bold'>{file.name.substring(0, 10)}{file.name.length > 10 ? '...' : ''}</p>
                <p className='text-xs'>{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            {
              deleteButton(index)
            }
          </div>
        })
      }
    </div>
  )
}
