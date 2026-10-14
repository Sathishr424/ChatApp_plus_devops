import type { GifItemData, Pagination, WithPagination } from "@/interfaces";
import GIFAPIService from "./GIFAPIService";

interface GifResponse {
  data: GifItemData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    has_next: boolean;
    next_page: number | null;
  };
}

class GIFService {
  private baseURL = "search"

  async getGIFs(search: string, pagination: Pagination): Promise<WithPagination<GifItemData[]>> {
    try {
      const data: GifResponse = await GIFAPIService.request(`${this.baseURL}?page=${Math.floor(pagination.offset / pagination.limit) + 1}&limit=${pagination.limit}&q=${search}`, "GET", {});
      return {
        nextCursor: null,
        nextCursorId: null,
        nextOffset: pagination.offset + pagination.limit,
        hasMore: data.pagination.has_next,
        data: data.data
      } as WithPagination<GifItemData[]>;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new GIFService();
