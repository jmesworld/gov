import { useMemo, useState } from 'react';
export const usePagination = ({
  defaultPage = 1,
  defaultLimit = 10,
  defaultTotal = 0,
}) => {
  const [page, setPage] = useState(defaultPage);
  const [limit, setLimit] = useState(defaultLimit);
  const [total, setTotal] = useState(defaultTotal);

  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

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
