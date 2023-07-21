export type PartialExcept<T, U extends keyof T> = {
  [key in keyof T]: key extends U ? Partial<T[U]> : T[key];
};

export function assertNullOrUndefined<T>(
  value: T | null | undefined,
): value is T {
  if (value === null || value === undefined) {
    return false;
  }
  return true;
}
