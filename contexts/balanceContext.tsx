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
  jmes: number;
  bJmes?: number;
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
    if (balance && balance?.bJmes > 0) {
      return 10 * 60 * 1000;
    }
    // refetch every one second if we have 0 balance
    return 1 * 1000;
  }, [balance]);

  const balanceFetchEnabled = useMemo(() => {
    return !!address;
  }, [address]);

  const { data, refetch } = useAccountBalance<false>(
    address,
    refetchInterval,
    balanceFetchEnabled,
  );
  useEffect(() => {
    if (!data) {
      return;
    }
    if (data?.bJmes === balance?.bJmes && data?.jmes === balance?.jmes) {
      return;
    }

    setBalance(data as any);
  }, [balance?.bJmes, balance?.jmes, data]);

  const value: BalanceContextType = {
    balance,
    refresh: refetch,
  };
  return (
    <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
  );
};

const useBalanceContext = () => useContext(BalanceContext);

export { useBalanceContext, BalanceContextProvider };
