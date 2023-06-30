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
  const { getSigningCosmWasmClient } = useChain(chainName);
  const [signingCosmWasmClient, setSigningCosmWasmClient] =
    useState<SigningCosmWasmClient | null>(null);

  useEffect(() => {
    if (!getSigningCosmWasmClient) {
      return;
    }
    async function assignSigningCosmWasmClient() {
      try {
        const client = await getSigningCosmWasmClient();
        setSigningCosmWasmClient(client);
      } catch (err) {
        console.error(err);
      }
    }
    assignSigningCosmWasmClient();
  }, [getSigningCosmWasmClient]);

  const value = {
    signingCosmWasmClient,
  };

  return (
    <SigningCosmWasmClientContext.Provider value={value}>
      {children}
    </SigningCosmWasmClientContext.Provider>
  );
};

const useSigningCosmWasmClientContext = () =>
  useContext(SigningCosmWasmClientContext);

export {
  useSigningCosmWasmClientContext,
  SigningCosmWasmClientContextProvider,
};
