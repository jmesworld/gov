import { z } from 'zod';
const minTitleLength = 4;
const maxTitleLength = 64;

const minDescriptionLength = 4;
const maxDescriptionLength = 1024;

export const proposalTitleValidator = z
  .string()
  .min(minTitleLength, {
    message: `Title must be at least ${minTitleLength} characters long`,
  })
  .max(maxTitleLength, {
    message: `Title must not exceed ${maxTitleLength} characters`,
  })
  .regex(/^[a-zA-Z0-9\s!&?#()*+'-./"']+$/, {
    message: 'Title must only contain alphanumeric characters',
  });

export const proposalDescriptionValidator = z
  .string()
  .min(minDescriptionLength, {
    message: `Description must be at least ${minDescriptionLength} characters long`,
  })
  .max(maxDescriptionLength, {
    message: `Description must not exceed ${maxDescriptionLength} characters`,
  })
  .regex(/^[a-zA-Z0-9\s!&?#()*+'-./"']+$/, {
    message: 'Description must only contain alphanumeric characters',
  });
