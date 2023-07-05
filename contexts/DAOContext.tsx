import { createContext, ReactNode, useContext, useState } from 'react';
import { useCosmWasmClientContext } from './CosmWasmClient';
import { useQuery } from '@tanstack/react-query';
import { getMyDaos } from '../actions/dao';
import { useIdentityContext } from './IdentityContext';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { IdentityserviceQueryClient } from '../client/Identityservice.client';

type Props = {
  children?: ReactNode;
};

const emptyFN = () => {
  throw new Error('Forgot to wrap your component with IdentityContextProvider');
};

type DAO = {
  address: string;
  name: string;
};
type DAOContextType = {
  daos: DAO[];
  selectedDAO: DAO | null;
  setSelectedDAOByName: (name: string | null) => void;
  getSelectedDAOByName: (name: string | null) => DAO | undefined;
  setSelectedDAOByAddress: (address: string) => void;
  loading: boolean;
};

const initialState: DAOContextType = {
  daos: [],
  selectedDAO: null,
  setSelectedDAOByName: emptyFN,
  setSelectedDAOByAddress: emptyFN,
  loading: false,
  getSelectedDAOByName: emptyFN,
};

const DAOContext = createContext<DAOContextType>(initialState);

const DAOContextProvider = ({ children }: Props) => {
  const [selectedDAO, setSelectedDAO] = useState<DAO | null>(null);
  const { cosmWasmClient } = useCosmWasmClientContext();
  const { address, identityServiceQueryClient } = useIdentityContext();

  const {
    data: DAOs,
    isLoading,
    isFetching,
  } = useQuery(
    ['myDAOs', { address, identityServiceQueryClient, cosmWasmClient }] as [
      string,
      {
        address: string;
        identityServiceQueryClient: IdentityserviceQueryClient;
        cosmWasmClient: CosmWasmClient;
      },
    ],
    ({ queryKey }) =>
      getMyDaos(
        queryKey[1].cosmWasmClient,
        queryKey[1].address,
        queryKey[1].identityServiceQueryClient,
      ) as Promise<DAO[] | undefined>,
    {
      refetchInterval: 5000,
      enabled: !!(cosmWasmClient && address),
    },
  );

  const setSelectedDAOByName = (name: string | null) => {
    if (name === null) {
      setSelectedDAO(null);
    }
    const DAO = DAOs?.find(el => el.name === name);
    if (!DAO) {
      return;
    }
    setSelectedDAO(DAO);
  };

  const getSelectedDAOByName = (name: string | null) => {
    if (!name) {
      return;
    }
    return DAOs?.find(el => el.name === name);
  };

  const setSelectedDAOByAddress = (address: string) => {
    const DAO = DAOs?.find(el => el.address === address);
    if (!DAO) {
      return;
    }
    setSelectedDAO(DAO);
  };

  const value = {
    daos: DAOs ?? [],
    selectedDAO,
    setSelectedDAOByAddress,
    setSelectedDAOByName,
    loading: isLoading || isFetching,
    getSelectedDAOByName,
  };
  return <DAOContext.Provider value={value}>{children}</DAOContext.Provider>;
};

const useDAOContext = () => useContext(DAOContext);

export { useDAOContext, DAOContextProvider };
