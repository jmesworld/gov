import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAccountBalance } from '../hooks/useAccountBalance';
import { useIdentityContext } from './IdentityContext';

type Props = {
  children?: ReactNode;
};
type Balance = {
  unstaked: number;
  staked: number;
};
const emptyFN = () => {
  throw new Error('Forgot to wrap your component with BalanceContextProvider');
};
type BalanceContextType = {
  balance: Balance | undefined;
  refresh: () => void;
};

const initialState: BalanceContextType = {
  balance: undefined,
  refresh: emptyFN,
};

const BalanceContext = createContext<BalanceContextType>(initialState);

const BalanceContextProvider = ({ children }: Props) => {
  const { address } = useIdentityContext();
  const [balance, setBalance] = useState<Balance | undefined>(undefined);

  const refetchInterval = useMemo(() => {
    if (balance && balance.unstaked > 0) {
      return 10 * 60 * 1000;
    }
    // refetch every one second if we have 0 balance
    return 1 * 1000;
  }, [balance]);

  const balanceFetchEnabled = useMemo(() => {
    return !!address;
  }, [address]);

  const currBalance = useAccountBalance(
    address,
    refetchInterval,
    balanceFetchEnabled,
  );
  useEffect(() => {
    if (!currBalance.data) {
      return;
    }
    if (
      currBalance.data?.staked === balance?.staked &&
      currBalance.data?.unstaked === balance?.unstaked
    ) {
      return;
    }
    setBalance(currBalance.data);
  }, [balance?.staked, balance?.unstaked, currBalance]);

  const value: BalanceContextType = {
    balance,
    refresh: currBalance.refetch,
  };
  return (
    <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
  );
};

const useBalanceContext = () => useContext(BalanceContext);

export { useBalanceContext, BalanceContextProvider };
