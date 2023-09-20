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
      // min is 1 ( to avoid 0 offset)
      return Math.max(1, total + 1 - (page - 1) * limit);
    }
    return (page - 1) * limit;
  }, [reverse, total, page, limit]);
  return {
    page,
    setPage,
    limit,
    setLimit,
    offset,
    total,
    setTotal,
  };
};
