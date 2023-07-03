export type PartialExcept<T, U extends keyof T> = {
  [key in keyof T]: key extends U ? Partial<T[U]> : T[key];
};
