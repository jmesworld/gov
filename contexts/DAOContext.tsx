import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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

type AfterCreateType = 'afterCreate' | 'loadedAfterCreate' | '';
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
  refetch: () => void;
  afterCreate: AfterCreateType;
  setAfterCreate: (type: AfterCreateType) => void;
  firstLoad: boolean;
};

const initialState: DAOContextType = {
  daos: [],
  selectedDAO: null,
  setSelectedDAOByName: emptyFN,
  setSelectedDAOByAddress: emptyFN,
  loading: false,
  getSelectedDAOByName: emptyFN,
  refetch: emptyFN,
  setAfterCreate: emptyFN,
  afterCreate: '',
  firstLoad: true,
};

const DAOContext = createContext<DAOContextType>(initialState);

const DAOContextProvider = ({ children }: Props) => {
  const [firstLoad, setFirstLoad] = useState(true);
  const [afterCreate, setAfterCreate] = useState<AfterCreateType>('');
  const [selectedDAO, setSelectedDAO] = useState<DAO | null>(null);
  const { cosmWasmClient } = useCosmWasmClientContext();
  const { address, identityServiceQueryClient, getIdentityName } =
    useIdentityContext();

  const {
    data: DAOs,
    isLoading,
    isFetching,
    refetch,
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
      enabled: !!(cosmWasmClient && address && getIdentityName()),
    },
  );
  const loading = useMemo(
    () => isFetching || isLoading,
    [isFetching, isLoading],
  );
  useEffect(() => {
    if (afterCreate === 'afterCreate' && !loading) {
      setAfterCreate('loadedAfterCreate');
      refetch();
    }
    if (afterCreate === 'loadedAfterCreate' && !loading) {
      setAfterCreate('');
    }
  }, [afterCreate, loading, refetch]);

  useEffect(() => {
    if (DAOs !== undefined && firstLoad) setFirstLoad(false);
  }, [DAOs, firstLoad]);

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

  useEffect(() => {
    if (address && getIdentityName()) {
      setFirstLoad(true);
    }
  }, [address, getIdentityName]);

  const setSelectedDAOByAddress = (address: string) => {
    const DAO = DAOs?.find(el => el.address === address);
    if (!DAO) {
      return;
    }
    setSelectedDAO(DAO);
  };

  const value = {
    firstLoad,
    daos: DAOs ?? [],
    selectedDAO,
    setSelectedDAOByAddress,
    setSelectedDAOByName,
    loading,
    getSelectedDAOByName,
    refetch,
    afterCreate,
    setAfterCreate,
  };
  return <DAOContext.Provider value={value}>{children}</DAOContext.Provider>;
};

const useDAOContext = () => useContext(DAOContext);

export { useDAOContext, DAOContextProvider };
