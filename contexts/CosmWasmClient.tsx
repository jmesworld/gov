import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { rpc } from '../config/defaults';
import LoadingComponent from '../features/components/genial/LoadingMessage';
import { Button } from '@chakra-ui/react';
import { ErrorAlert } from '../features/components/genial/Alert';

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
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState<number>(0);
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
      .catch(error => {
        setError(error.message);
        console.error(error);
      });
  }, [retry]);

  return (
    <CosmWasmClientContext.Provider value={value}>
      {!cosmWasmClient && !error && <LoadingComponent />}
      {cosmWasmClient && children}
      {error && (
        <ErrorAlert
          description={error}
          title={'Error connecting to WASM client!'}
        >
          <Button
            onClick={() => {
              setRetry(p => p + 1);
            }}
          >
            Retry
          </Button>
        </ErrorAlert>
      )}
    </CosmWasmClientContext.Provider>
  );
};

const useCosmWasmClientContext = () => useContext(CosmWasmClientContext);

export { useCosmWasmClientContext, CosmWasmClientContextProvider };
