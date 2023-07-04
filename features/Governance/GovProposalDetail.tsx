import {
  Box,
  Center,
  CircularProgress,
  Flex,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useChain } from '@cosmos-kit/react';

import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GovernanceQueryClient } from '../../client/Governance.client';
import { useGovernanceProposalQuery } from '../../client/Governance.react-query';

import { chainName } from '../../config/defaults';
import GovProposalMyVote from './GovProposalMyVote';
import GovProposalVoting from './GovProposalVoting';
import { ProposalHeader } from '../components/Proposal/ProposalHeader';
import { useCosmWasmClientContext } from '../../contexts/CosmWasmClient';
import { calculateVotes } from '../../lib/calculateVotes';
import { useCoinSupplyContext } from '../../contexts/CoinSupply';
import { useVotingPeriodContext } from '../../contexts/VotingPeriodContext';

const GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export default function GovProposalDetail({
  proposalId,
}: {
  proposalId: number;
}) {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const { supply } = useCoinSupplyContext();
  const { isPostingPeriod, nextPeriodTimeLeft } = useVotingPeriodContext();
  const { address } = useChain(chainName);

  const govQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    GOVERNANCE_CONTRACT,
  );

  const { data } = useGovernanceProposalQuery({
    client: govQueryClient,
    args: {
      id: proposalId,
    },
    options: {
      refetchInterval: 10000,
    },
  });

  const proposalDescription = data?.description ?? '';
  const expiryDate = data?.voting_end ?? 0;
  const expiryDateTimestamp = data ? expiryDate * 1000 : -1;

  const {
    coinYes,
    coinNo,
    threshold,
    thresholdPercent,
    yesPercentage,
    noPercentage,
  } = useMemo(
    () =>
      calculateVotes({
        coin_Yes: data?.coins_yes,
        coin_no: data?.coins_no,
        totalSupply: supply as number,
      }),
    [data?.coins_no, data?.coins_yes, supply],
  );

  const voted =
    (data?.yes_voters?.includes(address as string) ||
      data?.no_voters?.includes(address as string)) ??
    false;

  return (
    <>
      <Flex height={'47px'} />
      <ProposalHeader
        title="Governance Proposal"
        proposalTitle={data?.title ?? ''}
        proposalExpiry={expiryDateTimestamp}
      />
      {data ? (
        <HStack spacing="54px" align="flex-start">
          <Box flexGrow={1}>
            <GovProposalVoting
              yesCount={coinYes}
              noCount={coinNo}
              yesPercent={yesPercentage}
              noPercent={noPercentage}
              targetPercentage={thresholdPercent}
              target={threshold}
              yesVotesPercentage={yesPercentage}
              noVotesPercentage={noPercentage}
            />
            <Box
              background="rgba(112, 79, 247, 0.1)"
              borderRadius="12px"
              border="1px solid rgba(112, 79, 247, 0.5)"
              padding="14px 16px"
              marginTop="20px"
              height="300px"
            >
              <Text
                fontSize="16px"
                fontWeight="normal"
                color="rgba(81, 54, 194, 1)"
                fontFamily="DM Sans"
              >
                {proposalDescription}
              </Text>
            </Box>
          </Box>
          <VStack
            width="330px"
            pos="relative"
            height="full"
            spacing="30px"
            align="flex-start"
          >
            <GovProposalMyVote voted={voted} proposalId={proposalId}>
              {isPostingPeriod && (
                <Box
                  backdropFilter="auto"
                  backdropBlur="3px"
                  p="4"
                  width="full"
                  h="full"
                  m="auto"
                  zIndex="3"
                  bg="rgba(255,255,255,.5)"
                  pos="absolute"
                >
                  <Text fontSize="xl" textAlign="center">
                    Please wait until the posting period concludes.
                  </Text>
                  <Text textAlign="center">{nextPeriodTimeLeft}</Text>
                </Box>
              )}
            </GovProposalMyVote>
            {/* <ProposalDaoMembers
              selectedDaoMembersList={daoMembers}
            /> */}
          </VStack>
        </HStack>
      ) : (
        <Center marginTop={'80px'}>
          <CircularProgress isIndeterminate color="darkPurple" />
        </Center>
      )}
    </>
  );
}
