import { paginationLimit } from "@/config/paginationLimit";
import type { WithPagination } from "@/interfaces";
import type { Pagination } from "@/interfaces";
import { handleAPIRequest, updatePagination } from "@/utils/helper";
import { useCallback, useEffect, useRef, useState } from "react";

type ServiceRequest<T> = (search: string, pagination: Pagination) => Promise<WithPagination<T[]>>;

export default function usePagination<T>(source: ServiceRequest<T>, searchOptional: boolean = true) {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    hasMore: false,
    offset: 0,
    cursor: new Date(),
    cursor_id: -1,
    limit: paginationLimit.standard
  });
  const [loadMore, setLoadMore] = useState(false);
  const prevSearch = useRef<string>("init");
  const requestInterval = useRef<number | null>(null);
  const isFetchingRef = useRef(false);

  const fetch = useCallback(async () => {
    if (isFetchingRef.current) return false;
    if (!searchOptional && search.length === 0) return;

    isFetchingRef.current = true;

    try {
      const response: WithPagination<T[]> = await handleAPIRequest(async () => {
        return await source(search, pagination);
      }, setIsLoading);
      if (response === undefined) return false;
      updatePagination(setPagination, response);
      setData(prev => [...prev, ...response.data]);
    } catch {
      return false;
    } finally {
      isFetchingRef.current = false;
    }
    return true;
  }, [search, pagination, source, searchOptional])

  const queueFetch = async () => {
    await fetch();
    setLoadMore(false);
  }

  const reset = () => {
    setPagination({
      hasMore: false,
      offset: 0,
      cursor: new Date(),
      cursor_id: -1,
      limit: paginationLimit.standard
    });
    setData([]);
    setLoadMore(true);
  }

  const fetchMore = () => {
    if (!pagination.hasMore || isLoading) return;
    setLoadMore(true);
  }

  useEffect(() => {
    if (!loadMore) return;

    // eslint-disable-next-line
    queueFetch();
  }, [loadMore]);

  useEffect(() => {
    if (prevSearch.current === search) return;
    prevSearch.current = search;

    if (requestInterval.current !== null) clearInterval(requestInterval.current);
    requestInterval.current = setTimeout(() => {
      reset();
      requestInterval.current = null;
    }, 400);
  }, [search])

  return {
    search,
    setSearch,
    data,
    setData,
    fetchMore,
    isLoading,
    setIsLoading,
    pagination,
    setPagination,
    reset,
  }
}
