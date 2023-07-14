import { Flex, Text } from '@chakra-ui/react';
import { GovernanceQueryClient } from '../../client/Governance.client';
import { useGovernanceProposalsQuery } from '../../client/Governance.react-query';

import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

import GovHeader from './GovHeader';
import { ProposalHeader } from '../components/Proposal/ProposalList';
import { ProposalList } from '../components/Proposal/ProposalList';
import { useAppState } from '../../contexts/AppStateContext';
import { useCoinSupplyContext } from '../../contexts/CoinSupply';
import { useMemo } from 'react';

import { getProposalTypeForGovPublicProposals } from '../../utils/proposalUti';
import { ProposalResponse } from '../../client/Governance.types';
import { useVotingPeriodContext } from '../../contexts/VotingPeriodContext';

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
  const { data: votingData } = useVotingPeriodContext();
  const { setSelectedDaoProposalTitle } = useAppState();
  const { supply } = useCoinSupplyContext();
  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT,
  );

  const { data } = useGovernanceProposalsQuery({
    client: governanceQueryClient,
    args: {},
    options: {
      refetchInterval: 10000,
    },
  });
  const currentCycleProposals = useMemo(() => {
    if (!data) return [];
    return data.proposals
      .filter(p => p.status === 'voting' || p.status === 'posted')
      .sort(sortProposalsByType);
  }, [data]);

  const notConcluded = useMemo(() => {
    if (!data) return [];
    return data.proposals
      .filter(p => {
        if (p.status === 'success' || p.status === 'expired') {
          return true;
        }
        return false;
      })
      .sort(sortProposalsByType);
  }, [data]);

  const expired = useMemo(() => {
    if (!data) return [];
    const expired = data.proposals.filter(p => {
      if (p.status === 'expired_concluded') {
        return true;
      }
      if (p.status !== 'success_concluded') {
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /// @ts-ignore
      const fundDuration = p?.funding?.duration_in_blocks;
      if (!fundDuration) return true;

      if (
        (votingData?.current_block ?? 0) <=
        fundDuration + (p.concluded_at_height ?? 0)
      ) {
        return true;
      }
      return false;
    });

    const failed = expired
      .filter(p => p.status === 'expired_concluded')
      .sort(sortProposalsByType);
    const passed = expired
      .filter(p => p.status === 'success_concluded')
      .sort(sortProposalsByType);

    return [...passed, ...failed];
  }, [data, votingData?.current_block]);

  const funded = useMemo(() => {
    if (!data) return [];
    return data.proposals
      .filter(p => {
        if (p.status !== 'success_concluded') {
          return false;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        /// @ts-ignore
        const fundDuration = p?.funding?.duration_in_blocks;
        if (!fundDuration) return false;

        if (
          (votingData?.current_block ?? 0) >
          fundDuration + (p.concluded_at_height ?? 0)
        ) {
          return true;
        }
        return false;
      })
      .sort(sortProposalsByType);
  }, [data, votingData]);

  return (
    <Flex flexDir="column" pb="4">
      <Flex height={'35px'} />
      <GovHeader />
      <Flex height={'46px'} />
      <ProposalHeader isGov={true} />
      <Flex height={'10px'} />
      {currentCycleProposals.length > 0 && (
        <ProposalList
          isGovList
          client={governanceQueryClient}
          totalSupply={supply as number}
          proposals={currentCycleProposals}
          isGov={true}
          setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
          setSelectedProposalId={setSelectedProposalId}
        />
      )}

      {notConcluded.length > 0 && (
        <Flex flexDir="column">
          <Text my="4" fontSize="xs" color="textPrimary.100" mb="4">
            NOT CONCLUDED
          </Text>
          <ProposalList
            isGovList
            client={governanceQueryClient}
            totalSupply={supply as number}
            proposals={notConcluded}
            isGov={true}
            setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
            setSelectedProposalId={setSelectedProposalId}
          />
        </Flex>
      )}

      {funded.length > 0 && (
        <Flex flexDir="column">
          <Text
            my="4"
            fontSize="xs"
            autoCapitalize="all"
            color="textPrimary.100"
            mb="4"
          >
            FUNDED
          </Text>
          <ProposalList
            isGovList
            client={governanceQueryClient}
            totalSupply={supply as number}
            proposals={funded}
            isGov={true}
            setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
            setSelectedProposalId={setSelectedProposalId}
          />
        </Flex>
      )}
      {expired.length > 0 && (
        <Flex flexDir="column">
          <Text
            my="4"
            fontSize="xs"
            autoCapitalize="all"
            color="textPrimary.100"
            mb="4"
          >
            EXPIRED
          </Text>
          <ProposalList
            isGovList
            client={governanceQueryClient}
            totalSupply={supply as number}
            proposals={expired}
            isGov={true}
            setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
            setSelectedProposalId={setSelectedProposalId}
          />
        </Flex>
      )}
    </Flex>
  );
}
