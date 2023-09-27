import { useMemo, useState } from 'react';
export const usePagination = ({
  defaultPage = null,
  defaultLimit = 10,
  defaultTotal = null,
  reverse = false,
}: {
  defaultPage?: null | number;
  defaultLimit?: number;
  defaultTotal?: null | number;
  reverse?: boolean;
}) => {
  const [page, setPage] = useState(defaultPage);
  const [limit, setLimit] = useState(defaultLimit);
  const [total, setTotal] = useState(defaultTotal);

  const offset = useMemo(() => {
    if (!total || page === null) return 0;
    if (reverse) {
      return Math.max(0, total - (page - 1) * limit + 1);
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
