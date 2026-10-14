import { theme } from "@/config/theme";
import usePagination from "@/hooks/UsePagination";
import type { GifItemData, Pagination } from "@/interfaces";
import GIFService from "@/services/GIFService";
import { isScrollBarAtBottom } from "@/utils/helper";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import GifItem from "./GIFItem";

export default function GifPicker({ GIFSelectorOpen }: { GIFSelectorOpen: boolean }) {
  const fetch = useCallback(async (search: string, pagination: Pagination) => {
    return await GIFService.getGIFs(search, pagination);
  }, [])

  const { isLoading, fetchMore, data, search, setSearch } = usePagination<GifItemData>(fetch, false);

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;

    if (isScrollBarAtBottom(container)) {
      fetchMore();
    }
  }

  return <div className={`shadow-2xl p-2 ${theme.colors.border} transition-[height] border-t overflow-hidden flex flex-col ${GIFSelectorOpen ? `h-[50vh]` : 'h-0'}`}>
    <div className="w-full relative flex flex-row items-center ">
      <input placeholder="Search stickers..." className={`w-full rounded-lg py-2 pl-10 pr-2 ${theme.input.bg} ${theme.predefined.input}`} type="text" name="search" value={search} onChange={(ev) => setSearch(ev.target.value)} />
      <span className="absolute left-3">
        <FontAwesomeIcon className={`text-base ${theme.colors.muted}`} icon={faSearch} />
      </span>
    </div>

    <div onScroll={handleScroll} className="w-full flex-1 overflow-y-auto overflow-x-hidden my-2">
      <div className="columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5">
        {
          data.map((item, index) => {
            return <GifItem key={index} GIF={item} />
          })
        }
      </div>
      {
        isLoading ?
          <div className="w-full flex items-center justify-center">
            <div className={`w-6 h-6 border-4 rounded-full animate-spin my-2 ${theme.predefined.loading}`} />
          </div>
          : <></>
      }
    </div>
  </div>
}
