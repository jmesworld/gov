export interface IdentityError {
  message: string;
  name?: string;
  length?: number;
  min_length?: number;
  max_length?: number;
  c?: string;
}

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 32;
const invalid_char = /[^a-zA-Z0-9_]/;

export function validateName(name: string): void | IdentityError {
  const length = name.length;
  if (length < MIN_NAME_LENGTH) {
    return {
      message: "Name is too short",
      name: "NameTooShort",
      length,
      min_length: MIN_NAME_LENGTH,
    };
  } else if (length > MAX_NAME_LENGTH) {
    return {
      message: "Name is too long",
      name: "NameTooLong",
      length,
      max_length: MAX_NAME_LENGTH,
    };
  } else if (/[A-Z]/.test(name)) {
    return {
      message: "Name contains uppercase letter",
      name: "NameHasUpperCase",
      length,
      max_length: MAX_NAME_LENGTH,
    };
  } else {
    const bytepos_invalid_char_start = name.search(invalid_char);
    if (bytepos_invalid_char_start === -1) {
      return;
    } else {
      const c = name[bytepos_invalid_char_start];
      return {
        message: "Name contains invalid character",
        name: "InvalidCharacter",
        c,
      };
    }
  }
}

export function countObjectsWithDuplicateNames(
  objects: { name: string; address: string; votingPower: number }[]
): number {
  const nameCounts: Record<string, number> = {};

  // Count the occurrences of each name
  for (const obj of objects) {
    if (obj.name in nameCounts) {
      nameCounts[obj.name]++;
    } else {
      nameCounts[obj.name] = 1;
    }
  }

  // Count the objects with duplicate names
  let count = 0;
  for (const name in nameCounts) {
    if (nameCounts[name] > 1) {
      count++;
    }
  }

  return count;
}
