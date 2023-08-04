import { useMemo } from 'react';
import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';
import {
  useDaoMultisigListVotersQuery,
  useDaoMultisigListVotesQuery,
} from '../client/DaoMultisig.react-query';
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

  const votesQuery = useDaoMultisigListVotesQuery({
    client: daoQueryClient ?? undefined,
    args: { proposalId: proposalId! },
    options: { refetchInterval: 10000, enabled: proposalId !== undefined },
  });
  const daoMembers = useDaoMultisigListVotersQuery({
    client: daoQueryClient ?? undefined,
    args: {
      limit: 1000,
    },
    options: {
      enabled: votesQuery.data !== undefined,
    },
  });

  const memberVoted = useMemo(() => {
    return votesQuery?.data?.votes ?? [];
  }, [votesQuery?.data?.votes]);
  const voters = useMemo(() => {
    const members = daoMembers?.data?.voters ?? [];
    return members
      ?.sort((a, b) => b.weight - a.weight)
      ?.map(member => {
        const vote = memberVoted.find(vote => vote.voter === member.addr);
        return {
          ...member,
          voter: member.addr,
          vote: vote?.vote as string,
        };
      });
  }, [daoMembers?.data?.voters, memberVoted]);

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
