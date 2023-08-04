import { useMemo } from 'react';
import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';
import { useDaoMultisigListVotersQuery } from '../client/DaoMultisig.react-query';
import { DaoMultisigQueryClient } from '../client/DaoMultisig.client';
import { useDaoMultisigConfigQuery } from '../client/DaoMultisig.react-query';

export const useDaoMemberList = (id?: string, proposalId?: number) => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const daoQueryClient = useMemo(() => {
    if (!cosmWasmClient || !id || !proposalId) {
      return null;
    }
    return new DaoMultisigQueryClient(cosmWasmClient, id as string);
  }, [cosmWasmClient, id, proposalId]);

  const daoMembers = useDaoMultisigListVotersQuery({
    client: daoQueryClient ?? undefined,
    args: {
      limit: 1000,
    },
    options: {
      enabled: true,
    },
  });

  const voters = useMemo(() => {
    const members = daoMembers?.data?.voters ?? [];
    return members
      ?.sort((a, b) => b.weight - a.weight)
      ?.map(member => {
        return {
          ...member,
          voter: member.addr,
        };
      });
  }, [daoMembers?.data?.voters]);

  return {
    daoQueryClient,
    voters,
    ...daoMembers,
  };
};

export const useDao = (id?: string) => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const daoQueryClient = useMemo(() => {
    if (!cosmWasmClient || !id) {
      return null;
    }
    return new DaoMultisigQueryClient(cosmWasmClient, id as string);
  }, [cosmWasmClient, id]);

  const daoConfig = useDaoMultisigConfigQuery({
    client: daoQueryClient ?? undefined,
  });

  return {
    daoQueryClient,
    ...daoConfig,
  };
};
