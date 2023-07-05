import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';
import { GovernanceQueryClient } from '../client/Governance.client';
import { useGovernancePeriodInfoQuery } from '../client/Governance.react-query';
import { ReactNode, createContext, useContext, useMemo } from 'react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { momentLeft } from '../utils/time';
import { capitalizeFirstLetter } from '../lib/strings';
import { PeriodInfoResponse, ProposalPeriod } from '../client/Governance.types';

type Props = {
  children?: ReactNode;
};

type VotingPeriodContextType = {
  isPostingPeriod: boolean;
  postingPeriod: ProposalPeriod | null;
  period: string | null;
  nextPeriodTimeLeft: string | null;
  data?: PeriodInfoResponse | null;
};

const initialState: VotingPeriodContextType = {
  isPostingPeriod: false,
  postingPeriod: null,
  period: null,
  nextPeriodTimeLeft: null,
  data: null,
};

const VotingPeriodContext =
  createContext<VotingPeriodContextType>(initialState);

const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

const VotingPeriodContextProvider = ({ children }: Props) => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const governanceQueryClient = useMemo(
    () =>
      cosmWasmClient &&
      new GovernanceQueryClient(
        cosmWasmClient as CosmWasmClient,
        NEXT_PUBLIC_GOVERNANCE_CONTRACT,
      ),
    [cosmWasmClient],
  );
  const { data } = useGovernancePeriodInfoQuery({
    client: governanceQueryClient ?? undefined,
    options: {
      enabled: false ||governanceQueryClient !== null, // The query will only run when governanceQueryClient is not null
      refetchInterval: 5000,
      cacheTime: 5000,
      staleTime: 5000,
    },
  });
  const currentPeriod = useMemo(
    () => data?.current_period,
    [data?.current_period],
  );
  const nextTimePeriod = useMemo(() => {
    const nextVotingStart = data?.next_voting_start;
    const nextPostingStart = data?.next_posting_start;

    const nextPeriodStart =
      currentPeriod === 'posting' ? nextPostingStart : nextVotingStart;
    const nextPeriodStartTimeLeft = momentLeft(nextPeriodStart).toString();
    return nextPeriodStartTimeLeft;
  }, [currentPeriod, data?.next_posting_start, data?.next_voting_start]);

  const value = {
    isPostingPeriod: currentPeriod === 'posting',
    period: capitalizeFirstLetter(currentPeriod),
    postingPeriod: currentPeriod as ProposalPeriod,
    nextPeriodTimeLeft: nextTimePeriod,
    data,
  };

  return (
    <VotingPeriodContext.Provider value={value}>
      {children}
    </VotingPeriodContext.Provider>
  );
};

const useVotingPeriodContext = () => useContext(VotingPeriodContext);

export { useVotingPeriodContext, VotingPeriodContextProvider };
