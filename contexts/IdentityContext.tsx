import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { Identity } from '../client/Identityservice.types';
import { useCosmWasmClientContext } from './CosmWasmClient';
import { IdentityserviceQueryClient } from '../client/Identityservice.client';
import { chainName, IDENTITY_SERVICE_CONTRACT } from '../config/defaults';
import { useIdentityserviceGetIdentityByOwnerQuery } from '../client/Identityservice.react-query';
import { useChain } from '@cosmos-kit/react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

type Props = {
  children?: ReactNode;
};

const emptyFN = () => {
  throw new Error('Forgot to wrap your component with IdentityContextProvider');
};

type IdentityContextType = {
  identity: Identity | null;
  getIdentityName: () => string | undefined;
  loadingIdentity: boolean;
  address: string | undefined;
  disconnect: () => void;
  identityServiceQueryClient?: IdentityserviceQueryClient;
};

const initialState: IdentityContextType = {
  identity: null,
  getIdentityName: emptyFN,
  loadingIdentity: false,
  address: undefined,
  disconnect: emptyFN,
};

const IdentityContext = createContext<IdentityContextType>(initialState);

const IdentityContextProvider = ({ children }: Props) => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const { address, disconnect } = useChain(chainName);

  const identityserviceClient = useMemo(
    () =>
      cosmWasmClient
        ? new IdentityserviceQueryClient(
            cosmWasmClient as CosmWasmClient,
            IDENTITY_SERVICE_CONTRACT,
          )
        : undefined,
    [cosmWasmClient],
  );
  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceClient,
    args: { owner: address as string },
    options: {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!address,
    },
  });

  const getIdentityName = useCallback(() => {
    const loading = identityOwnerQuery?.isLoading;
    const name = identityOwnerQuery?.data?.identity?.name;
    if (name) return name;
    if (loading) return 'loading ...';
    return undefined;
  }, [identityOwnerQuery?.data?.identity?.name, identityOwnerQuery?.isLoading]);

  const value = {
    identity: identityOwnerQuery?.data?.identity ?? null,
    getIdentityName,
    address,
    loadingIdentity:
      identityOwnerQuery?.isLoading || identityOwnerQuery?.isFetching,
    disconnect,
    identityServiceQueryClient: identityserviceClient,
  };
  return (
    <IdentityContext.Provider value={value}>
      {children}
    </IdentityContext.Provider>
  );
};

const useIdentityContext = () => useContext(IdentityContext);

export { useIdentityContext, IdentityContextProvider };
