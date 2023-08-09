import { GovernanceQueryClient } from '../../client/Governance.client';
import { useEffect, useMemo } from 'react';
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

type GovernanceProps = {
  governanceQueryClient: GovernanceQueryClient;
};

export const useGovernanceProposals = ({
  governanceQueryClient,
  status,
}: GovernanceProps & { status: ProposalQueryStatus }): {
  data: ProposalsResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  pagination?: {
    limit: number;
    offset: number;
    page: number;
    setPage: (page: number) => void;
    total: number;
  };
} => {
  const { setTotal, total, limit, offset, page, setPage } = usePagination({});

  const { data, isLoading, isFetching } = useGovernanceProposalsQuery({
    client: governanceQueryClient,
    args: {
      status: status,
      limit,
      start: offset,
    },
    options: {
      enabled: !!status,
      refetchInterval: 10000,
    },
  });

  useEffect(() => {
    if (!data || !data?.proposal_count) return;
    if (data.proposal_count && total !== data.proposal_count) {
      setTotal(data?.proposal_count);
    }
  }, [data, setTotal, total]);

  return {
    data,
    isLoading,
    isFetching,
    pagination: {
      limit,
      offset,
      page,
      setPage,
      total,
    },
  };
};

export const useGovernanceWinningGrants = ({
  governanceQueryClient,
}: GovernanceProps): {
  data: ProposalsResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
} => {
  const {
    data,
    isLoading: loadingWinningGrants,
    isFetching: fetchingWinningGrants,
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
      queryFn: () => governanceQueryClient.proposal({ id: proposal }),
      enabled: !!proposal,
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
  };
};
