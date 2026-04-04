import { useState, useMemo, useEffect } from 'react';

/**
 * Client-side pagination over an array.
 *
 * @param {Array}  items    - The filtered array to paginate.
 * @param {number} pageSize - Items per page (default 8).
 * @returns {{ paged, page, setPage, totalPages, from, to, total }}
 */
export function usePagination(items, pageSize = 8) {
  const [page, setPage] = useState(1);

  // Reset to first page whenever items change (e.g. after a search query changes)
  useEffect(() => { setPage(1); }, [items]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage   = Math.min(page, totalPages);

  const paged = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize],
  );

  const from  = items.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to    = Math.min(safePage * pageSize, items.length);
  const total = items.length;

  return { paged, page: safePage, setPage, totalPages, from, to, total };
}
