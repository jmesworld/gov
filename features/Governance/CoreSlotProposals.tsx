import { GovernanceQueryClient } from '../../client/Governance.client';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useAppState } from '../../contexts/AppStateContext';
import { useCoinSupplyContext } from '../../contexts/CoinSupply';
import { getProposalTypeForGovPublicProposals } from '../../utils/proposalUti';
import { ProposalResponse } from '../../client/Governance.types';
import GovernanceProposalComponent from './GovernanceProposalComponent';
import { useMemo } from 'react';
import { useCoreSlotProposalsContext } from '../../contexts/CoreSlotProposalsContext';

const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;
type Props = {
  cosmWasmClient: CosmWasmClient;
  setSelectedProposalId: (id: number) => void;
};

// ORDER OF PROPOSAL TYPES
const proposalTypeOrder = {
  revoke_proposal: 1,
  core_slot: 2,
  text: 3,
  improvement: 4,
  feature_request: 5,
};
const sortProposalsByType = (a: ProposalResponse, b: ProposalResponse) => {
  const aType = getProposalTypeForGovPublicProposals(a);
  const bType = getProposalTypeForGovPublicProposals(b);
  if (!aType || !bType) return 0;
  if (aType === bType) {
    return 0;
  }
  return proposalTypeOrder[aType] - proposalTypeOrder[bType];
};

export default function GovernanceProposal({
  setSelectedProposalId,
  cosmWasmClient,
}: Props) {
  const { setSelectedDaoProposalTitle } = useAppState();
  const { supply } = useCoinSupplyContext();
  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT,
  );

  const { data, isLoading } = useCoreSlotProposalsContext();

  const sorted = useMemo(() => {
    if (!data) return [];
    return data.proposals.sort(sortProposalsByType);
  }, [data]);

  return (
    <GovernanceProposalComponent
      tab="core-slots"
      setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
      governanceQueryClient={governanceQueryClient}
      setSelectedProposalId={setSelectedProposalId}
      supply={supply as number}
      proposalTitle={'CORE SLOT PROPOSALS'}
      data={sorted}
      isLoading={isLoading}
      isFetching={isLoading}
    />
  );
}
