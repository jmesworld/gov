import { Core } from 'jmes';

type BalanceType = { total: number; current: number; transfer: number };
export const movingValidator = (
  balance: BalanceType,
  bonding: boolean,
  selectedUnBondingValidator?: Core.Delegation,
) => {
  if (!bonding && selectedUnBondingValidator) {
    const amount =
      Number(
        selectedUnBondingValidator.balance.amount
          .dividedBy(Math.pow(10, 6))
          .toNumber()
          .toFixed(0),
      ) || 0;
    return balance.transfer > amount
      ? `You can't un-bond more than the validator ${amount}`
      : undefined;
  }
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
