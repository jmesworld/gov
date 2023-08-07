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
    if (!cosmWasmClient || !id) {
      return null;
    }
    return new DaoMultisigQueryClient(cosmWasmClient, id as string);
  }, [cosmWasmClient, id]);
  const daoMembers = useDaoMultisigListVotersQuery({
    client: daoQueryClient ?? undefined,
    args: {
      limit: 1000,
    },
    options: {
      enabled: true,
    },
  });

  const votesQuery = useDaoMultisigListVotesQuery({
    client: daoQueryClient ?? undefined,
    args: {
      proposalId: proposalId!,
    },
    options: {
      enabled: proposalId !== undefined,
    },
  });

  const voters = useMemo(() => {
    const memberVoted = votesQuery?.data?.votes ?? [];

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
  }, [daoMembers?.data?.voters, votesQuery?.data?.votes]);

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
