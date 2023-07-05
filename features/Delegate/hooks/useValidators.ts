import { useEffect, useState } from 'react';
import { Client } from 'jmes';
import { Validator } from '../types';
import { useQuery } from '@tanstack/react-query';
import { useIdentityContext } from '../../../contexts/IdentityContext';

type Pagination = {
  total: number | null;
  limit: number;
  offset: number;
};

const getUniquePage = (limit: number, offest: number) => {
  return JSON.stringify({
    limit,
    offest,
  });
};

const getValidators = ({
  queryKey,
  client,
}: {
  queryKey: (string | number)[];
  client: Client;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, limit, offset, page] = queryKey;
  return client.getValidators({
    'pagination.limit': limit,
    'pagination.offset': offset,
    'pagination.count_total': 'true',
    'pagination.reverse': 'false',
  });
};

const getBondedValidators = ({
  queryKey,
  client,
}: {
  queryKey: (string | number)[];
  client: Client;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, address] = queryKey;
  return client.providers.LCDC.staking.delegations(address as string);
};

const getUnBondings = ({
  queryKey,
  client,
}: {
  client: Client;
  queryKey: (string | number)[];
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, address] = queryKey;

  return client.providers.LCDC.staking.unbondingDelegations(address as string);
};

export const useValidators = (client: Client) => {
  const { address } = useIdentityContext();
  const [pagination, setPagination] = useState<Pagination>({
    limit: 10,
    offset: 0,
    total: null,
  });
  const [validatorList, setValidatorList] = useState<
    Record<string, Validator[]>
  >({});

  const {
    isFetching: isFetchingUnBondings,
    isLoading: isLoadingUnBondings,
    error: unBondingsError,
    data: unBondingsData,
  } = useQuery({
    queryKey: ['unBondings', address as string],
    queryFn: ({ queryKey }) => getUnBondings({ queryKey, client }),
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    onError(err) {
      console.error('Error:', err);
    },
  });

  const {
    isFetching: isFetchingValidators,
    isLoading: isLoadingValidators,
    error: validatorsError,
    data: validatorsData,
  } = useQuery({
    queryKey: ['validators', pagination.limit, pagination.offset],
    queryFn: ({ queryKey }) => getValidators({ queryKey, client }),
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    onError(err) {
      console.error('Error:', err);
    },
  });

  const {
    data: bondedValidators,
    error: bondedValidatorsError,
    isLoading: isLoadingBondedValidators,
    isFetching: isFetchingBondedValidators,
  } = useQuery({
    queryKey: ['bondedValidators', address as string],
    queryFn: ({ queryKey }) =>
      getBondedValidators({ queryKey, client }).then(r => {
        return r;
      }),
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    onError(err) {
      console.error('Error:', err);
    },
  });

  useEffect(() => {
    if (validatorsData?.[0]) {
      setValidatorList(p => ({
        ...p,
        [getUniquePage(pagination.limit, pagination.offset)]: validatorsData[0],
      }));
    }
    if (validatorsData?.[1]) {
      setPagination(p => {
        const total = validatorsData[1].total ?? p.total;
        return {
          ...p,
          total,
          offset: p.offset * p.limit > total ? p.offset + p.limit : p.offset,
        };
      });
    }
  }, [pagination.limit, pagination.offset, validatorList, validatorsData]);

  return {
    unBondingsData: unBondingsData?.[0],
    unBondingsError,
    isLoadingUnBondings: isFetchingUnBondings || isLoadingUnBondings,
    validatorsError,
    bondedValidatorsError,
    bondedValidators: bondedValidators?.[0],
    isBondedValidatorsLoading:
      isFetchingBondedValidators || isLoadingBondedValidators,
    isValidatorsLoading: isFetchingValidators || isLoadingValidators,
    validatorList: Object.values(validatorList).flat(),
  };
};
