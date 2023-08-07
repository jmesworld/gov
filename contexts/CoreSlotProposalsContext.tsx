import { ReactNode, createContext, useContext, useMemo } from 'react';
import { ProposalResponse } from '../client/Governance.types';
import { useCoreSlotProposals } from '../features/Governance/useGovernance';
import { useCosmWasmClientContext } from './CosmWasmClient';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { NEXT_PUBLIC_GOVERNANCE_CONTRACT } from '../config/defaults';
import { GovernanceQueryClient } from '../client/Governance.client';

type CoreSlotProposalContextType = {
  data: {
    proposals: ProposalResponse[];
    proposal_count: number;
  };
  refetch?: () => void;
  isLoading: boolean;
  error: Error | Error[];
  coreSlotDaoIds?: string[];
};

const emptyFN = () => {
  throw new Error(
    'Forgot to wrap component in `CoreSlotProposalsContextProvider`',
  );
};

const initailState: CoreSlotProposalContextType = {
  data: {
    proposals: [],
    proposal_count: 0,
  },
  isLoading: false,
  refetch: emptyFN,
  coreSlotDaoIds: [],
  error: [],
};

export const CoreSlotProposalsContext =
  createContext<CoreSlotProposalContextType>(initailState);

type Props = {
  children?: ReactNode;
};
export const CoreSlotProposalsContextProvider = ({ children }: Props) => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const governanceQueryClient = useMemo(
    () =>
      new GovernanceQueryClient(
        cosmWasmClient as CosmWasmClient,
        NEXT_PUBLIC_GOVERNANCE_CONTRACT,
      ),
    [cosmWasmClient],
  );
  const { data, isLoading, refetch, error } = useCoreSlotProposals({
    governanceQueryClient,
  });
  const coreSlotDaoIds = useMemo(
    () =>
      data?.proposals.filter(proposal => proposal.dao).map(el => el.dao) ?? [],
    [data],
  );

  return (
    <CoreSlotProposalsContext.Provider
      value={{ error, data, isLoading, refetch, coreSlotDaoIds }}
    >
      {children}
    </CoreSlotProposalsContext.Provider>
  );
};

export const useCoreSlotProposalsContext = () =>
  useContext(CoreSlotProposalsContext);
