/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Box,
  Center,
  CircularProgress,
  Flex,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react';
import { chainName } from '../../../config/defaults';

import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DaoMultisigQueryClient } from '../../../client/DaoMultisig.client';
import {
  useDaoMultisigProposalQuery,
  useDaoMultisigListVotesQuery,
  useDaoMultisigListVotersQuery,
} from '../../../client/DaoMultisig.react-query';
import { ProposalHeader } from '../../components/Proposal/ProposalHeader';
import { ProposalMyVote } from '../../components/Proposal/ProposalMyVote';
import { ProposalVoting } from '../../components/Proposal/ProposalVoting';
import { useCosmWasmClientContext } from '../../../contexts/CosmWasmClient';

type Props = {
  selectedDao: string;
  selectedDaoName: string;
  selectedDaoProposalTitle: string;
  selectedDaoProposalId: number;
};

export default function DaoProposalDetail({
  selectedDao,
  selectedDaoName,
  selectedDaoProposalTitle,
  selectedDaoProposalId,
}: Props) {
  const { address } = useChain(chainName);
  const { cosmWasmClient } = useCosmWasmClientContext();

  const daoMultisigQueryClient = new DaoMultisigQueryClient(
    cosmWasmClient as CosmWasmClient,
    selectedDao as string,
  );

  const proposalDetailQuery = useDaoMultisigProposalQuery({
    client: daoMultisigQueryClient,
    args: {
      proposalId: selectedDaoProposalId,
    },
    options: {
      refetchInterval: 1000,
    },
  });
  const votesQuery = useDaoMultisigListVotesQuery({
    client: daoMultisigQueryClient,
    args: { proposalId: selectedDaoProposalId },
    options: { refetchInterval: 10000 },
  });

  const votersQuery = useDaoMultisigListVotersQuery({
    client: daoMultisigQueryClient,
    args: {},
    options: { refetchInterval: 10000 },
  });

  const proposalDescription = proposalDetailQuery?.data?.description ?? '';
  /// @ts-ignore
  const expiryDate = proposalDetailQuery?.data?.expires?.at_height ?? 0;
  const averageBlockTime = 5; // Average block time in seconds
  const genesisTimestamp = 1684768989000; // Genesis timestamp
  const expiryDateTimestamp = proposalDetailQuery?.data
    ? genesisTimestamp + expiryDate * averageBlockTime * 1000
    : -1;

  const threshold =
    /// @ts-ignore
    proposalDetailQuery?.data?.threshold?.absolute_count;
  const target = threshold ? threshold.weight : 0;
  const yesPercentage = threshold ? threshold.total_weight : 0;

  const votes = votesQuery?.data?.votes ?? [];

  const myVotingInfo = votersQuery?.data?.voters.filter(
    voter => voter.addr === (address as string),
  ) ?? [{ weight: 0 }];
  const myVotingPower = myVotingInfo[0]?.weight;

  const passed = proposalDetailQuery?.data?.status === 'passed';
  const myVotes =
    votesQuery?.data?.votes.filter(
      vote => vote.voter === (address as string),
    ) ?? [];
  return (
    <>
      <Flex height={'47px'} />
      <ProposalHeader
        title={selectedDaoName}
        daoName={selectedDaoName}
        proposalTitle={proposalDetailQuery?.data?.title ?? ''}
        proposalExpiry={expiryDateTimestamp}
      />
      {proposalDetailQuery.isLoading ||
        (proposalDetailQuery.isFetching && !proposalDetailQuery?.data && (
          <Center marginTop={'80px'}>
            <CircularProgress isIndeterminate color="darkPurple" />
          </Center>
        ))}

      {proposalDetailQuery.data && (
        <HStack spacing="54px" align="flex-start">
          <Box flexGrow={1} cursor="pointer">
            <ProposalVoting
              yesPercentage={yesPercentage}
              target={target}
              votes={votes}
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
          <VStack width="330px" spacing="30px" align="flex-start">
            <ProposalMyVote
              myVotingPower={myVotingPower}
              passed={passed}
              voted={myVotes.length > 0}
              dao={selectedDao}
              proposalId={selectedDaoProposalId}
            />
            {/* <ProposalDaoMembers
              selectedDaoMembersList={daoMembers}
            /> */}
          </VStack>
        </HStack>
      )}
    </>
  );
}
