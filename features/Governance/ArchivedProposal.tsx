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
import { LoadMore } from '../components/genial/LoadMore';

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
  tab,
}: Props) => {
  const { setSelectedDaoProposalTitle } = useAppState();

  const { supply } = useCoinSupplyContext();
  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT,
  );

  const { data, pagination, isFetched, isFetching, isLoading } =
    useGovernanceProposals({
      governanceQueryClient,
      status: status,
      reverse: true,
    });

  const expiredConcludedSorted = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.proposals.sort(sortProposalsByType);
  }, [data]);

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
        proposalTitle={title}
        data={expiredConcludedSorted}
        fetched={!!isFetched}
        isLoading={isFetching || isLoading}
        tab={tab}
      />
      <LoadMore
        loading={!!pagination?.loading}
        enabled={!!pagination?.loadMore}
        nextPage={() => {
          pagination?.fetchNext();
        }}
      />
    </>
  );
};

export default ArchivedGovernanceProposal;
