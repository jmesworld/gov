import { z } from 'zod';

const minChar = 3;
const maxChar = 20;

export const daoNameSchema = z
  .string()
  .min(minChar, {
    message: `Name must be at least ${minChar} characters long`,
  })
  .max(maxChar, {
    message: `Name must be at most ${maxChar} characters long`,
  })
  .regex(/^[a-z0-9]+$/, {
    message: `Name must only contain lowercase letters and numbers`,
  });
