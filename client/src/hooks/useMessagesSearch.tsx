import { useUsersContext } from "@/contexts/UsersContext";
import type { MessasgesSearchProps, Pagination, ScrollToMessageFunction } from "@/interfaces";
import GroupChatService from "@/services/GroupChatService";
import OneToOneChatService from "@/services/OneToOneChatService";
import { useCallback, useEffect, useState } from "react";
import usePagination from "./UsePagination";

export default function useMessagesSearch(scrollToMessage: ScrollToMessageFunction) {
  const [searchModalToggle, setSearchModalToggle] = useState<boolean>(false);
  const [index, setIndex] = useState(-1);
  const { selectedRecipient } = useUsersContext()

  const fetch = useCallback(async (search: string, pagination: Pagination) => {
    if (selectedRecipient === null) throw new Error("Reciepient not selected");
    const recipientService = selectedRecipient.is_group ? GroupChatService : OneToOneChatService;
    return await recipientService.getMessageSearchIds(selectedRecipient!.id, search, pagination);
  }, [selectedRecipient])

  const { isLoading, pagination, reset, fetchMore, data: ids, search, setSearch } = usePagination<number>(fetch, false);

  const nextResult = () => {
    if (index > 0) {
      setIndex(index - 1);
    } else if (!pagination.hasMore) {
      setIndex(getTotal() - 1);
    }
  }

  const prevResult = async () => {
    if (index + 1 < ids.length) {
      setIndex(index + 1);
    } else if (pagination.hasMore) {
      fetchMore();
    } else if (ids.length > 0) {
      setIndex(0);
    }
  }

  const isMore = () => {
    return pagination.hasMore;
  }

  const getTotal = () => {
    return ids.length;
  }

  const getIndex = () => {
    return index;
  }

  useEffect(() => {
    if (search.length > 0 && index != -1) {
      scrollToMessage(selectedRecipient!, ids[index]);
    }
  }, [index, ids, selectedRecipient, scrollToMessage])

  const reload = () => {
    reset();
    setIndex(-1);
  }

  const clear = () => {
    reload();
    setSearch("");
  }

  useEffect(() => {
    (() => clear())();
  }, [selectedRecipient])

  useEffect(() => {
    // eslint-disable-next-line
    setIndex(-1);
  }, [search])

  return {
    search,
    setSearch,
    nextResult,
    prevResult,
    searchModalToggle,
    setSearchModalToggle,
    isMore,
    getTotal,
    getIndex,
    isLoading,
    doSearch: reload,
  } as MessasgesSearchProps
}
