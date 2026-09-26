import { useMemo, useState } from 'react';

export function usePagination<T>(items: T[], pageSize = 6) {
  const [page, setPage] = useState(1);
  const pageItems = useMemo(() => items.slice((page - 1) * pageSize, page * pageSize), [items, page, pageSize]);
  return { page, setPage, pageItems, total: items.length, pageSize };
}
