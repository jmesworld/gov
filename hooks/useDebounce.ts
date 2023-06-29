import { useEffect, useState } from 'react';

type Props<T> = {
  value: T;
  delay: number;
};

export const useDebounce = <T>({ value, delay }: Props<T>): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
