export interface WithPaginationDTO<T> {
  nextOffset?: number | null,
  nextCursor?: Date | null,
  nextCursorId?: number | null,
  cursorId?: number | null,
  hasMore: boolean,
  data: T
}
