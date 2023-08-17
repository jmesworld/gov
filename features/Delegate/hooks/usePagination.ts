import { useMemo, useState } from 'react';
export const usePagination = ({
  defaultPage = 1,
  defaultLimit = 10,
  defaultTotal = 0,
  reverse = false,
}) => {
  const [page, setPage] = useState(defaultPage);
  const [limit, setLimit] = useState(defaultLimit);
  const [total, setTotal] = useState(defaultTotal);

  const offset = useMemo(() => {
    if (reverse) {
      if (!total) return 0;
      return Math.max(0, total + 1 - (page - 1) * limit);
    }
    return (page - 1) * limit;
  }, [reverse, total, page, limit]);
  const pagination = useMemo(
    () => ({
      page,
      setPage,
      limit,
      setLimit,
      offset,
      total,
      setTotal,
    }),
    [page, setPage, limit, setLimit, offset, total, setTotal],
  );

  return pagination;
};
