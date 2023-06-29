type BalanceType = { total: number; current: number };
export const movingValidator = (balance: BalanceType) => {
  if (balance.total === 0) {
    return 'You need James balance to bond';
  }
  if (balance.current === 0) {
    return 'Enter a value to bond';
  }
  return undefined;
};
