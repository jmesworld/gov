import { GovernanceQueryClient } from '../../client/Governance.client';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useAppState } from '../../contexts/AppStateContext';
import { getProposalTypeForGovPublicProposals } from '../../utils/proposalUti';
import {
  ProposalQueryStatus,
  ProposalResponse,
} from '../../client/Governance.types';
import { useGovernanceProposals } from './useGovernance';
import GovernanceProposalComponent from './GovernanceProposalComponent';
import { useEffect, useMemo, useState } from 'react';
import GovHeader from './GovHeader';
import { Flex, Text } from '@chakra-ui/react';
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
  const [showProposalMessage, setShowProposalMessage] = useState(false);
  console.log('refreshing ...');
  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT,
  );

  const { pagination, data, isFetched, isFetching, isLoading } =
    useGovernanceProposals({
      governanceQueryClient,
      status: status,
      reverse: true,
    });

  const expiredConcludedSorted = useMemo(() => {
    if (!data) {
      return [];
    }
    return (data.proposals ?? []).sort(sortProposalsByType);
  }, [data]);

  useEffect(() => {
    if (!isFetched) {
      return;
    }
    if (pagination?.loading) {
      return;
    }
    if (!pagination?.data) {
      return;
    }
    if (pagination.data.proposals.length !== 0) {
      return;
    }
    setShowProposalMessage(true);
  }, [pagination, isFetched]);

  return (
    <>
      <Flex height={'35px'} />
      <GovHeader />
      <Flex height={'46px'} />

      <GovernanceProposalComponent
        setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
        governanceQueryClient={governanceQueryClient}
        setSelectedProposalId={setSelectedProposalId}
        proposalTitle={title}
        data={expiredConcludedSorted}
        fetched={data !== null}
        isLoading={(isFetching || isLoading) && data === null}
        tab={tab}
      />

      {showProposalMessage && pagination?.loadMore && (
        <Flex mb="2">
          <Text size="sm" color="lilac">
            No proposals with status{' '}
            <span
              style={{
                fontWeight: 700,
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </span>{' '}
            returned, click again to load more
          </Text>
        </Flex>
      )}
      <LoadMore
        loading={!!pagination?.loading}
        enabled={!!pagination?.loadMore}
        nextPage={() => {
          setShowProposalMessage(false);
          pagination?.fetchNext();
        }}
      />
    </>
  );
};

export default ArchivedGovernanceProposal;
