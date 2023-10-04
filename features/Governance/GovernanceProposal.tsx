import { GovernanceQueryClient } from '../../client/Governance.client';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useAppState } from '../../contexts/AppStateContext';
import { useCoinSupplyContext } from '../../contexts/CoinSupply';
import { getProposalTypeForGovPublicProposals } from '../../utils/proposalUti';
import { ProposalResponse } from '../../client/Governance.types';
import { useGovernanceProposals } from './useGovernance';
import GovernanceProposalComponent from './GovernanceProposalComponent';
import { useMemo } from 'react';
import GovHeader from './GovHeader';
import { Flex, Skeleton } from '@chakra-ui/react';

const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;
type Props = {
  cosmWasmClient: CosmWasmClient;
  setSelectedProposalId: (id: number) => void;
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

  const { data, isFetched, isFetching, isLoading } = useGovernanceProposals({
    governanceQueryClient,
    status: 'active',
    loadAll: true,
  });

  const active = useMemo(() => {
    return data?.proposals.filter(
      proposal =>
        proposal.status !== 'expired' && proposal.status !== 'success',
    );
  }, [data?.proposals]);

  const notConcluded = useMemo(() => {
    return data?.proposals.filter(
      proposal =>
        proposal.status === 'expired' || proposal.status === 'success',
    );
  }, [data?.proposals]);

  const sortedActive = useMemo(() => {
    if (!active) return [];
    return active.sort(sortProposalsByType);
  }, [active]);

  const sortedNotConcluded = useMemo(() => {
    if (!notConcluded) return [];
    return notConcluded.sort(sortProposalsByType);
  }, [notConcluded]);

  return (
    <>
      <Flex height={'35px'} />
      <GovHeader />
      <Flex height={'46px'} />
      {data?.proposals.length === 0 && isLoading && isFetching && (
        <Flex flexDir="column" justifyContent="center" alignItems="center">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              startColor="skeleton.200"
              endColor="lilac"
              rounded="lg"
              key={i}
              height="89px"
              width="100%"
              mb="10px"
            />
          ))}
        </Flex>
      )}
      {sortedActive.length !== 0 && (
        <GovernanceProposalComponent
          setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
          governanceQueryClient={governanceQueryClient}
          setSelectedProposalId={setSelectedProposalId}
          supply={supply as number}
          proposalTitle={'ACTIVE PROPOSALS'}
          data={sortedActive}
          fetched={isFetched}
        />
      )}
      {sortedNotConcluded.length !== 0 && (
        <GovernanceProposalComponent
          setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
          governanceQueryClient={governanceQueryClient}
          setSelectedProposalId={setSelectedProposalId}
          supply={supply as number}
          proposalTitle={'EXPIRED PROPOSALS'}
          data={sortedNotConcluded}
          fetched={isFetched}
        />
      )}
    </>
  );
}
