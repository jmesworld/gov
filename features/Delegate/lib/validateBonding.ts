type BalanceType = { total: number; current: number; transfer: number };
export const movingValidator = (balance: BalanceType, bonding: boolean) => {
  if (balance.total === 0) {
    return 'You have no balance to move';
  }
  if (bonding && balance.current === 0) {
    return `Your JMES balance can't be 0`;
  }
  if (balance.transfer === 0) {
    return `Enter a value to ${bonding ? 'bond' : 'un-bond'}`;
  }
  return undefined;
};
