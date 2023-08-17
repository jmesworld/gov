import { QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { IdentityserviceQueryClient } from '../client/Identityservice.client';
import { useEffect, useMemo } from 'react';
import { queryClient } from '../pages/_app';
import { GetIdentityByOwnerResponse } from '../client/Identityservice.types';

const cacheTime = Infinity;
const staleTime = Infinity;
const retry = 3;

type Props = {
  client: IdentityserviceQueryClient | undefined;
  value: string;
  type: 'name' | 'address';
  enabled?: boolean;
  moreOptions?: QueryObserverOptions<GetIdentityByOwnerResponse>;
};

export const useIdentityFetch = ({
  client,
  value,
  type,
  enabled = true,
  moreOptions = {},
}: Props) => {
  const queryKey = useMemo(
    () => ['identity by value', value, type],
    [value, type],
  );

  const queryFn = async (): Promise<GetIdentityByOwnerResponse> => {
    if (!client) {
      return Promise.reject('client not found');
    }

    if (queryKey[2] === 'name') {
      return client.getIdentityByName({
        name: value,
      });
    }
    return client.getIdentityByOwner({ owner: value });
  };

  const query = useQuery({
    queryKey,
    queryFn,
    enabled,
    cacheTime,
    staleTime,
    retry,
    ...moreOptions,
  });
  useEffect(() => {
    const { data } = query;
    if (!data) {
      return;
    }

    if (data?.identity?.name) {
      return;
    }
    queryClient.cancelQueries(queryKey);
  }, [query, queryKey]);

  return query;
};
