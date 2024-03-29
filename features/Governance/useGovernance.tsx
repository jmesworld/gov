import { GovernanceQueryClient } from '../../client/Governance.client';
import { useEffect, useMemo, useState } from 'react';
import { usePagination } from '../Delegate/hooks/usePagination';
import {
  useGovernanceCoreSlotsQuery,
  useGovernanceProposalsQuery,
  useGovernanceWinningGrantsQuery,
} from '../../client/Governance.react-query';
import {
  ProposalQueryStatus,
  ProposalsResponse,
} from '../../client/Governance.types';
import { useQueries } from '@tanstack/react-query';
import { assertNullOrUndefined } from '../../utils/ts';
import { useCallbackRef } from '@chakra-ui/react';

type GovernanceProps = {
  governanceQueryClient: GovernanceQueryClient;
};

const defaultLimit = 10;
export const useGovernanceProposals = ({
  governanceQueryClient,
  status,
  loadAll,
  concatResult = true,
}: GovernanceProps & {
  status: ProposalQueryStatus;
  loadAll?: boolean;
  reverse?: boolean;
  concatResult?: boolean;
}): {
  data:
    | {
        proposals: ProposalsResponse['proposals'] | null;
        proposal_count: number;
      }
    | undefined;
  isLoading: boolean;
  isFetched: boolean;
  isFetching: boolean;
  pagination?: {
    fetchNext: () => void;
    loadMore: boolean;
    loading: boolean;
    data: ProposalsResponse | undefined;
  };
} => {
  const [isFetchingOnDemand, setIsFetchingOnDemand] = useState(false);
  const { setTotal, total, limit, offset, page, setPage } = usePagination({
    reverse: true,
    defaultPage: 1,
    defaultTotal: null,
    defaultLimit,
  });
  const [startBefore, setStartBefore] = useState<number | undefined>(undefined);
  const [proposalsData, setProposalData] = useState<
    ProposalsResponse['proposals'] | null
  >(null);

  const { data, isLoading, isFetching, isFetched } =
    useGovernanceProposalsQuery({
      client: governanceQueryClient,
      args: {
        status,
        limit,
        startBefore,
      },
      options: {
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: !!status,
        retry: 3,
        refetchInterval: loadAll ? false : 5000,
        cacheTime: 5000,
        staleTime: 5000,
      },
    });

  useEffect(() => {
    if (!loadAll) {
      return;
    }

    const interval = setInterval(() => {
      setPage(1);
      setStartBefore(undefined);
    }, 5500);

    return () => {
      clearInterval(interval);
    };
  }, [loadAll, setPage]);

  const updateStartBefore = useCallbackRef(
    (onDemand = true) => {
      if (onDemand) {
        setIsFetchingOnDemand(true);
      }
      if (!data) {
        setPage(1);
        return;
      }

      const { proposals, proposal_count } = data;
      if (proposal_count <= limit) {
        return;
      }

      if (!proposals.length) {
        setStartBefore(Math.max((startBefore ?? 10) - limit, 0));
        return;
      }
      const lastProposal = proposals[proposals.length - 1];
      if (!lastProposal) {
        return;
      }
      setStartBefore(lastProposal.id);
    },
    [offset],
  );

  const isPaginationActive = useMemo(() => {
    if (startBefore === 0 || startBefore === 1 || offset == 0) {
      return false;
    }
    if (startBefore === undefined && (total ?? 0) <= limit) {
      return false;
    }
    return true;
  }, [limit, offset, startBefore, total]);

  useEffect(() => {
    if (!loadAll || !data) {
      return;
    }
    if (data.proposal_count && total !== data.proposal_count) {
      setTotal(data?.proposal_count);
    }
    const { proposals } = data;

    setProposalData(p => [...(p ?? []), ...proposals]);
  }, [data, isPaginationActive, loadAll, setTotal, total, updateStartBefore]);

  useEffect(() => {
    if (!data || loadAll) {
      return;
    }
    setIsFetchingOnDemand(false);
    if (data.proposal_count && total !== data.proposal_count) {
      setTotal(data?.proposal_count);
    }
    const { proposals } = data;

    setProposalData(p => [...(p ?? []), ...proposals]);
  }, [
    concatResult,
    data,
    isPaginationActive,
    limit,
    loadAll,
    offset,
    page,
    setPage,
    setTotal,
    total,
    updateStartBefore,
  ]);

  const uniqueProposals = useMemo(() => {
    if (!proposalsData) return null;
    const proposalUniqueMap = new Map<
      number,
      ProposalsResponse['proposals'][0]
    >();
    proposalsData.forEach(proposal => {
      proposalUniqueMap.set(proposal.id, proposal);
    });
    return Array.from(proposalUniqueMap.values());
  }, [proposalsData]);

  const pagination = useMemo(
    () => ({
      loadMore: isPaginationActive,
      fetchNext: updateStartBefore,
      loading: isFetchingOnDemand,
      data,
    }),
    [data, isFetchingOnDemand, isPaginationActive, updateStartBefore],
  );

  return {
    data:
      loadAll || concatResult
        ? ({
            proposals: uniqueProposals,
            proposal_count: total,
          } as ProposalsResponse)
        : (page ?? 0) >= 1
        ? data
        : undefined,
    isLoading,
    isFetching,
    isFetched,
    pagination,
  };
};

export const useGovernanceWinningGrants = ({
  governanceQueryClient,
}: GovernanceProps): {
  data: ProposalsResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isFetched: boolean;
  error: Error | null;
} => {
  const {
    isFetched: isFetchedWinningGrants,
    data,
    isLoading: loadingWinningGrants,
    isFetching: fetchingWinningGrants,
    error: winningGrantsError,
  } = useGovernanceWinningGrantsQuery({
    client: governanceQueryClient,
    options: {
      refetchInterval: 10000,
    },
  });
  const result = useQueries({
    queries: (data?.winning_grants || []).map(grant => ({
      queryKey: ['funded', 'proposal', grant.proposal_id],
      queryFn: () => governanceQueryClient.proposal({ id: grant.proposal_id }),
      enabled: !!grant.proposal_id,
    })),
  });
  const isLoading =
    result.some(query => query.isLoading) || loadingWinningGrants;
  const isFetching =
    result.some(query => query.isFetching) || fetchingWinningGrants;

  const isFetched =
    isFetchedWinningGrants && result.every(query => query.isFetched);
  const error =
    winningGrantsError ||
    result
      .map(query => query.error as Error | null)
      .filter(assertNullOrUndefined)?.[0];

  const governanceData = result
    .map(query => query.data)
    .filter(assertNullOrUndefined);

  return {
    data: {
      proposal_count: governanceData.length,
      proposals: governanceData,
    },
    isLoading,
    isFetching,
    isFetched,
    error,
  };
};

export const useCoreSlotProposals = ({
  governanceQueryClient,
}: GovernanceProps) => {
  const {
    error: coreSlotError,
    data,
    isLoading: loadingCoreSlot,
    isFetching: fetchingCoreSlot,
    refetch: refetchCoreSlot,
    isFetched: isFetchedCoreSlot,
  } = useGovernanceCoreSlotsQuery({
    client: governanceQueryClient,

    options: {
      refetchInterval: 10000,
    },
  });
  const listOfCoreSlotProposals = useMemo(() => {
    const result: (number | undefined)[] = [];
    if (!data) return [];
    if ('brand' in data) {
      result.push(data.brand?.proposal_id as number | undefined);
    }
    if ('creative' in data) {
      result.push(data.creative?.proposal_id as number | undefined);
    }

    if ('core_tech' in data) {
      result.push(data.core_tech?.proposal_id as number | undefined);
    }
    return result.filter(assertNullOrUndefined);
  }, [data]);
  const result = useQueries({
    queries: listOfCoreSlotProposals.map(proposal => ({
      queryKey: ['core_slot', 'proposal', proposal],
      queryFn: async () => {
        try {
          return await governanceQueryClient.proposal({ id: proposal });
        } catch (e) {
          console.error('e', e);
          return null;
        }
      },
      enabled: proposal !== undefined,
    })),
  });
  const isLoading = result.some(query => query.isLoading) || loadingCoreSlot;
  const isFetching = result.some(query => query.isFetching) || fetchingCoreSlot;

  const governanceData = result
    .map(query => query.data)
    .filter(assertNullOrUndefined);

  const refetch = async () => {
    await refetchCoreSlot();
    await Promise.all(
      listOfCoreSlotProposals.map(proposal =>
        governanceQueryClient.proposal({ id: proposal }),
      ),
    );
  };

  const isFetched =
    isFetchedCoreSlot && result.every(query => query.error || query.isFetched);
  const error =
    coreSlotError ||
    result
      .map(query => query.error as Error | null)
      .filter(assertNullOrUndefined);
  return {
    data: {
      proposal_count: governanceData.length,
      proposals: governanceData,
    },
    isLoading: isLoading || isFetching,
    refetch,
    error,
    isFetched,
  };
};
