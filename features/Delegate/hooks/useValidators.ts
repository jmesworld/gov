import { useEffect, useMemo, useState } from 'react';
import { Client } from 'jmes';
import { Validator } from '../types';
import { useQuery } from '@tanstack/react-query';
import { useIdentityContext } from '../../../contexts/IdentityContext';
import { client } from '../../../contexts/validatorsContext';
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

const getBondValidators = ({
  queryKey,
}: {
  queryKey: (string | number)[];
  client: Client;
}) => {
  return client.providers.LCDC.staking.validators();
};

const getUnBondValidators = ({
  queryKey,
}: {
  queryKey: (string | number)[];
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, address] = queryKey;
  return client.providers.LCDC.staking.delegations(address as string);
};

const getMyUnBondings = ({ queryKey }: { queryKey: (string | number)[] }) => {
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
  const [bondValidatorList, setBondValidatorList] = useState<
    Record<string, Validator[]>
  >({});

  const {
    refetch: refetchMyUnBondings,
    isFetching: isFetchingMyUnBondings,
    isLoading: isLoadingMyUnBondings,
    error: myUnBondingsError,
    data: myUnBondingsData,
  } = useQuery({
    queryKey: ['myUnBondings', address as string],
    queryFn: ({ queryKey }) => getMyUnBondings({ queryKey }),
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    onError(err) {
      console.error('Error:', err);
    },
  });
  const {
    refetch: refetchBondValidators,
    isFetching: isFetchingBondValidators,
    isLoading: isLoadingBondValidators,
    error: bondValidatorsError,
    data: bondValidatorsData,
  } = useQuery({
    queryKey: ['bondingValidators', pagination.limit, pagination.offset],
    queryFn: ({ queryKey }) => getBondValidators({ queryKey, client }),
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    onError(err) {
      console.error('Error:', err);
    },
  });
  const {
    refetch: refetchUnBondValidators,
    data: unBondValidators,
    error: unBondedValidatorsError,
    isLoading: isLoadingUnBondValidators,
    isFetching: isFetchingUnBondValidators,
  } = useQuery({
    queryKey: ['unBondValidators', address as string],
    queryFn: ({ queryKey }) =>
      getUnBondValidators({ queryKey }).then(r => {
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
    if (bondValidatorsData?.[0]) {
      setBondValidatorList(p => ({
        ...p,
        [getUniquePage(pagination.limit, pagination.offset)]:
          bondValidatorsData[0],
      }));
    }
    if (bondValidatorsData?.[1]) {
      setPagination(p => {
        const total = bondValidatorsData[1].total ?? p.total;
        return {
          ...p,
          total,
          offset: p.offset * p.limit > total ? p.offset + p.limit : p.offset,
        };
      });
    }
  }, [pagination.limit, pagination.offset, bondValidatorsData]);

  const bondList = useMemo(() => {
    return Object.values(bondValidatorList).flat();
  }, [bondValidatorList]);
  return {
    refetchMyUnBondings,
    refetchBondValidators,
    refetchUnBondValidators,
    myUnBondings: myUnBondingsData?.[0],
    myUnBondingsError,
    isLoadingMyUnBondings: isFetchingMyUnBondings || isLoadingMyUnBondings,
    bondValidatorsError,
    unBondedValidatorsError,
    unBondValidators: unBondValidators?.[0],
    isLoadingUnBondValidators:
      isFetchingUnBondValidators || isLoadingUnBondValidators,
    isLoadingBondValidators:
      isFetchingBondValidators || isLoadingBondValidators,
    bondValidators: bondList,
  };
};
