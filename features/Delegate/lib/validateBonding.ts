type BalanceType = { total: number; current: number; transfer: number };
export const movingValidator = (balance: BalanceType) => {
  if (balance.total === 0) {
    return 'You have no balance to move';
  }
  if (balance.current === 0) {
    return `Your James balance can't be 0`;
  }
  if (balance.transfer === 0) {
    return 'Enter a value to bond';
  }
  return undefined;
};
