export const convertMonthToBlock = (month: number): number => {
  return (month * 2629745) / 5;
};
