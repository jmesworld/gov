import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useChain } from '@cosmos-kit/react';
import { chainName } from '../config/defaults';
import { Alert, Button } from '@chakra-ui/react';
import { ErrorAlert } from '../features/components/genial/Alert';
import LoadingComponent from '../features/components/genial/LoadingMessage';

type Props = {
  children?: ReactNode;
};

interface SigningCosmWasmClientContextType {
  signingCosmWasmClient: SigningCosmWasmClient | null;
}

const initialState: SigningCosmWasmClientContextType = {
  signingCosmWasmClient: null,
};

const SigningCosmWasmClientContext =
  createContext<SigningCosmWasmClientContextType>(initialState);

const SigningCosmWasmClientContextProvider = ({ children }: Props) => {
  const { getSigningCosmWasmClient, address } = useChain(chainName);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState<number>(0);

  const [signingCosmWasmClient, setSigningCosmWasmClient] =
    useState<SigningCosmWasmClient | null>(null);
  useEffect(() => {
    async function assignSigningCosmWasmClient() {
      try {
        const client = await getSigningCosmWasmClient();
        setSigningCosmWasmClient(client);
      } catch (err) {
        console.error(err);
        setError(String(err));
      }
    }
    if (address) assignSigningCosmWasmClient();
    // getSigningCosmWasmClient is a function that changes on every render so we can see changes by address only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, retry]);
  const value = {
    signingCosmWasmClient,
  };

  return (
    <SigningCosmWasmClientContext.Provider value={value}>
      {error && <Alert status="error">{error}</Alert>}
      {error && (
        <ErrorAlert
          description={error}
          title={'Error Connecting to WASM client!'}
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
      {!signingCosmWasmClient && !error && <LoadingComponent />}
      {signingCosmWasmClient && children}
    </SigningCosmWasmClientContext.Provider>
  );
};

const useSigningCosmWasmClientContext = () =>
  useContext(SigningCosmWasmClientContext);

export {
  useSigningCosmWasmClientContext,
  SigningCosmWasmClientContextProvider,
};
