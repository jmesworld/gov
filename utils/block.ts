const SECONDS_IN_A_MONTH = 2629745;

export const convertMonthToBlock = (month: number): number => {
  return (month * SECONDS_IN_A_MONTH) / 5;
};

export const convertBlockToMonth = (block: number): number => {
  return (block * 5) / SECONDS_IN_A_MONTH;
};

export const convertTimestampToBlock = (timestamp: number): number => {
  return timestamp / 5;
};
