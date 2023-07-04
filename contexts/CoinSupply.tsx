import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Client } from 'jmes';
const client = new Client({
  providers: {
    LCDC: {
      URL: process.env.NEXT_PUBLIC_REST_URL as string,
      chainID: process.env.NEXT_PUBLIC_CHAIN_ID as string,
    },
  },
});
type Props = {
  children?: ReactNode;
};

interface CoinSupplyContextType {
  supply: number | null;
}

const initialState: CoinSupplyContextType = {
  supply: null,
};

const CoinSupplyContext = createContext<CoinSupplyContextType>(initialState);

const CoinSupplyContextProvider = ({ children }: Props) => {
  const [coinSupply, setCoinSupply] = useState<number | null>(null);
  const value = {
    supply: coinSupply,
  };

  useEffect(() => {
    client
      .getSupply('bujmes')
      .then(result => {
        const amount = result?.amount?.toNumber();
        if (!amount) {
          console.error('No result for Coin supply');
          return;
        }
        const totalSupply = amount - 100000000000000;
        setCoinSupply(totalSupply);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <CoinSupplyContext.Provider value={value}>
      {children}
    </CoinSupplyContext.Provider>
  );
};

const useCoinSupplyContext = () => useContext(CoinSupplyContext);

export { useCoinSupplyContext, CoinSupplyContextProvider };
