import { GovernanceQueryClient } from '../../client/Governance.client';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useAppState } from '../../contexts/AppStateContext';
import { useCoinSupplyContext } from '../../contexts/CoinSupply';
import { getProposalTypeForGovPublicProposals } from '../../utils/proposalUti';
import {
  ProposalQueryStatus,
  ProposalResponse,
} from '../../client/Governance.types';
import { useGovernanceProposals } from './useGovernance';
import GovernanceProposalComponent from './GovernanceProposalComponent';
import { useMemo } from 'react';
import GovHeader from './GovHeader';
import { Flex } from '@chakra-ui/react';

const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;
type Props = {
  cosmWasmClient: CosmWasmClient;
  setSelectedProposalId: (id: number) => void;
  status: ProposalQueryStatus;
  title: string;
  tab: string;
};
// ORDER OF PROPOSAL TYPES
const proposalTypeOrder = {
  improvement: 1,
  revoke_proposal: 2,
  core_slot: 3,
  text: 4,
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
const ArchivedGovernanceProposal = ({
  setSelectedProposalId,
  cosmWasmClient,
  status,
  title,
  tab
}: Props) => {
  const { setSelectedDaoProposalTitle } = useAppState();

  const { supply } = useCoinSupplyContext();
  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT,
  );

  const {
    data: expiredConcludedData,
    pagination: expiredConcludedPagination,
    isFetched: expiredConcludedFetched,
  } = useGovernanceProposals({
    governanceQueryClient,
    status: status,
  });

  const expiredConcludedSorted = useMemo(() => {
    if (!expiredConcludedData) {
      return [];
    }
    return expiredConcludedData.proposals.sort(sortProposalsByType);
  }, [expiredConcludedData]);

  return (
    <>
      <Flex height={'35px'} />
      <GovHeader />
      <Flex height={'46px'} />

      <GovernanceProposalComponent
        setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
        governanceQueryClient={governanceQueryClient}
        setSelectedProposalId={setSelectedProposalId}
        supply={supply as number}
        pagination={expiredConcludedPagination}
        proposalTitle={title}
        data={expiredConcludedSorted}
        fetched={!!expiredConcludedFetched}
        tab={tab}
      />
    </>
  );
};

export default ArchivedGovernanceProposal;
