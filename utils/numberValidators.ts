import { KeyboardEvent } from 'react';
import { z } from 'zod';

export const numberWithDecimals = (decimals: number) =>
  z.string().regex(new RegExp(`^[0-9]+(\\.[0-9]{1,${decimals}})?$`));

export const numberWithNoDecimals = z.string().regex(/^[0-9]+$/);

export const allowedCharacters = [
  'Backspace',
  'ArrowLeft',
  'ArrowRight',
  'Delete',
  'Enter',
];

export const onNumberWithDecimalKeyDown =
  (decimals: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;

    if (allowedCharacters.includes(key)) {
      return;
    }

    if (numberWithDecimals(decimals).safeParse(key).success) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
  };

export const onNumberWithNoDecimalKeyDown = (
  e: KeyboardEvent<HTMLInputElement>,
) => {
  const { key } = e;

  if (
    ['ArrowLeft', 'Backspace', 'ArrowRight', 'Delete', 'Enter'].includes(key)
  ) {
    return;
  }

  if (numberWithNoDecimals.safeParse(key).success) {
    return;
  }

  e.preventDefault();
  e.stopPropagation();
};
