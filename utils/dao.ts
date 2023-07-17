import { z } from 'zod';

const minChar = 3;
const maxChar = 20;

export const daoNameSchema = z
  .string()
  .min(minChar, {
    message: `Name must exceed ${minChar} characters`,
  })
  .max(maxChar, {
    message: `Name must not exceed ${maxChar} characters`,
  })
  .regex(/^[a-z0-9]+$/, {
    message: `Name must only contain lowercase letters and numbers`,
  });
