import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { rpc } from '../config/defaults';

type Props = {
  children?: ReactNode;
};

interface CosmWasmClientContextType {
  cosmWasmClient: CosmWasmClient | null;
}

const initialState: CosmWasmClientContextType = {
  cosmWasmClient: null,
};

const CosmWasmClientContext =
  createContext<CosmWasmClientContextType>(initialState);

const CosmWasmClientContextProvider = ({ children }: Props) => {
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null,
  );
  const value = {
    cosmWasmClient,
  };

  useEffect(() => {
    CosmWasmClient.connect(rpc)
      .then(cosmWasmClient => {
        if (!cosmWasmClient) {
          return;
        }
        setCosmWasmClient(cosmWasmClient);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <CosmWasmClientContext.Provider value={value}>
      {children}
    </CosmWasmClientContext.Provider>
  );
};

const useCosmWasmClientContext = () => useContext(CosmWasmClientContext);

export { useCosmWasmClientContext, CosmWasmClientContextProvider };
