import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { formatBalance, useAccountBalance } from '../hooks/useAccountBalance';
import { useIdentityContext } from './IdentityContext';
import { Core } from 'jmes';

type Props = {
  children?: ReactNode;
};
type Balance = {
  jmes: number;
  bJmes?: number;
};
type FormattedBalance = {
  jmes: string;
  bJmes?: string;
};

type BalanceCoins = {
  jmes: Core.Coin;
  bJmes?: Core.Coin;
};
const emptyFN = () => {
  throw new Error('Forgot to wrap your component with BalanceContextProvider');
};
type BalanceContextType = {
  balance: Balance | undefined;
  refresh: () => void;
  formattedBalance?: FormattedBalance;
  balanceCoins?: BalanceCoins;
  formattedWithSuffix?: FormattedBalance;
};

const initialState: BalanceContextType = {
  balance: undefined,
  refresh: emptyFN,
  formattedBalance: undefined,
  balanceCoins: undefined,
  formattedWithSuffix: undefined,
};

const BalanceContext = createContext<BalanceContextType>(initialState);

const BalanceContextProvider = ({ children }: Props) => {
  const { address } = useIdentityContext();
  const [jmesCoin, setJmesCoin] = useState<Core.Coin | undefined>(undefined);
  const [bJmesCoin, setBJmesCoin] = useState<Core.Coin | undefined>(undefined);

  const refetchInterval = useMemo(() => {
    if (jmesCoin && jmesCoin.amount.equals(0)) {
      return 10 * 60 * 1000;
    }
    // refetch every one second if we have 0 balance
    return 1 * 1000;
  }, [jmesCoin]);

  const balanceFetchEnabled = useMemo(() => {
    return !!address;
  }, [address]);

  const { data, refetch } = useAccountBalance(
    address,
    refetchInterval,
    balanceFetchEnabled,
  );
  useEffect(() => {
    if (!data) {
      return;
    }
    if (
      data?.jmes?.toString() === bJmesCoin?.toString() &&
      data?.jmes?.toString() === jmesCoin?.toString()
    ) {
      return;
    }

    setJmesCoin(data.jmes);
    setBJmesCoin(data.bJmes);
  }, [bJmesCoin, data, jmesCoin]);

  const formattedWithSuffix = useMemo(() => {
    if (!data) {
      return undefined;
    }
    const jmes = formatBalance(
      data.jmes?.amount.dividedBy(1e6).toDecimalPlaces(1).toNumber() ?? 0,
    );
    const bJmes = formatBalance(
      data.bJmes?.amount.dividedBy(1e6).toDecimalPlaces(1).toNumber() ?? 0,
    );
    return {
      jmes: String(jmes),
      bJmes: String(bJmes),
    };
  }, [data]);

  const formattedBalance = useMemo(() => {
    if (!data) {
      return undefined;
    }
    const jmes =
      data.jmes?.amount.dividedBy(1e6).toDecimalPlaces(6).toLocaleString() ??
      '0';
    const bJmes =
      data.bJmes?.amount.dividedBy(1e6).toDecimalPlaces(6).toLocaleString() ??
      '0';
    return {
      jmes,
      bJmes,
    };
  }, [data]);

  const balance = useMemo(() => {
    if (!data) {
      return undefined;
    }
    const jmes =
      data.jmes?.amount.dividedBy(1e6).toDecimalPlaces(1).toNumber() ?? 0;
    const bJmes =
      data.bJmes?.amount.dividedBy(1e6).toDecimalPlaces(1).toNumber() ?? 0;
    return {
      jmes,
      bJmes,
    };
  }, [data]);

  const value: BalanceContextType = {
    balance,
    refresh: refetch,
    formattedBalance,
    formattedWithSuffix,
    balanceCoins:
      jmesCoin && bJmesCoin
        ? {
            jmes: jmesCoin,
            bJmes: bJmesCoin,
          }
        : undefined,
  };
  return (
    <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
  );
};

const useBalanceContext = () => useContext(BalanceContext);

export { useBalanceContext, BalanceContextProvider };
