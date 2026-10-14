import { useMesssagesContext } from "@/contexts/MessagesContext";
import { faArrowDown, faArrowUp, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import Modal from "../Modal";
import { theme } from "@/config/theme";

export default function SearchModal({ setIsModalOpen }: { setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { messagesSearchData } = useMesssagesContext();
  const { isLoading, getIndex, getTotal, isMore, search, setSearch, nextResult, prevResult } = messagesSearchData;
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    prevResult();
  }

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [])

  return <Modal transparency="NONE" setIsModalOpen={setIsModalOpen}>
    <div className={`absolute flex flex-row justify-center items-center rounded top-5 right-0 my-2 mr-3 z-30 ${theme.colors.background} border ${theme.colors.border} p-2 shadow-lg`}>
      <div className="mx-2">
        {
          isLoading ? <div className={`w-6 h-6 border-4 ${theme.predefined.loading} rounded-full animate-spin my-2`} />
            : <p>{getIndex() + 1}/{isMore() ? "?" : getTotal()}</p>
        }
      </div>
      <form onSubmit={onSubmit}>
        <div className="w-full relative flex flex-row items-center ">
          <input ref={inputRef} placeholder="Search" className={`pl-10 pr-1 py-1 rounded max-w-50 ${theme.predefined.input}`} type="text" name="search" value={search} onChange={(ev) => setSearch(ev.target.value)} />
          <span className="absolute left-3">
            <FontAwesomeIcon className={`text-base ${theme.colors.muted}`} icon={faSearch} />
          </span>
        </div>
      </form>
      <div className="mr-1">
        <button disabled={isLoading} onClick={prevResult} type="button" className={`p-1 mx-1 ${theme.colors.background} hover:${theme.colors.selected} cursor-pointer`}>
          <FontAwesomeIcon className="text-base" icon={faArrowUp} />
        </button>
        <button disabled={isLoading} onClick={nextResult} type="button" className={`p-1 ${theme.colors.background} hover:${theme.colors.selected} cursor-pointer`}>
          <FontAwesomeIcon className="text-base" icon={faArrowDown} />
        </button>
      </div>
    </div>
  </Modal>
}

