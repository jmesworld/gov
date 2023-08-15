/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useMemo } from 'react';
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
import {
  IDENTITY_SERVICE_CONTRACT,
  NEXT_PUBLIC_GOVERNANCE_CONTRACT,
  chainName,
} from '../../../config/defaults';

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
import DirectoresList from '../Proposal/Components/DirectorsList';
import {
  GetProposalDetail,
  GovProposalType,
} from '../Proposal/Components/ProposalType';
import { ProposalExcuteRawData } from '../Proposal/Components/ProposalRawData';
import { useDAOContext } from '../../../contexts/DAOContext';
import { getGovProposalType, isProposalGov } from '../../../utils/proposalUti';
import { GovernanceQueryClient } from '../../../client/Governance.client';
import { useVotingPeriodContext } from '../../../contexts/VotingPeriodContext';
import { getLabel } from '../../../utils/daoProposalUtil';
import { IdentityserviceQueryClient } from '../../../client/Identityservice.client';
import { DaoProposalFunding } from '../../Governance/ProposalFunding';
import { AutoResizeTextarea } from '../../components/genial/ResizableInput';
import { useCoreSlotProposalsContext } from '../../../contexts/CoreSlotProposalsContext';

type Props = {
  selectedDao: string;
  selectedDaoName: string;
  selectedDaoProposalTitle: string;
  selectedDaoProposalId: number;
};

export default function DaoProposalDetail({
  selectedDao,
  selectedDaoName,
  selectedDaoProposalId,
}: Props) {
  const { address } = useChain(chainName);
  const { coreSlotDaoIds } = useCoreSlotProposalsContext();
  const { cosmWasmClient } = useCosmWasmClientContext();
  const { setSelectedDAOByAddress } = useDAOContext();
  const { isPostingPeriod, data: periodData } = useVotingPeriodContext();

  useEffect(() => {
    setSelectedDAOByAddress(selectedDao);
  }, [selectedDao, setSelectedDAOByAddress]);

  const client: IdentityserviceQueryClient = useMemo(
    () =>
      new IdentityserviceQueryClient(
        cosmWasmClient as CosmWasmClient,
        IDENTITY_SERVICE_CONTRACT,
      ),
    [cosmWasmClient],
  );

  const goverrnanceQueryClient = useMemo(
    () =>
      new GovernanceQueryClient(
        cosmWasmClient as CosmWasmClient,
        NEXT_PUBLIC_GOVERNANCE_CONTRACT,
      ),
    [cosmWasmClient],
  );

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

  const disableExcute = useMemo(() => {
    if (!isPostingPeriod) {
      return 'Please wait until the posting period';
    }
    if (!proposalDetailQuery?.data) {
      return 'Loading...';
    }
    const proposalType = getGovProposalType(proposalDetailQuery?.data);

    if (proposalType.proposalType !== 'core-slot') {
      return undefined;
    }
    if (coreSlotDaoIds?.includes(selectedDao)) {
      return undefined;
    }
    const postingPeriodBlock = periodData?.posting_period_length ?? 0;
    const currentBlockTime = periodData?.current_time_in_cycle ?? 0;

    return currentBlockTime > postingPeriodBlock / 2
      ? 'Please wait until Week 1 of the Posting window to execute this Proposal'
      : undefined;
  }, [isPostingPeriod, periodData, proposalDetailQuery?.data]);

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

  const daoMembers = useDaoMultisigListVotersQuery({
    client: daoMultisigQueryClient,
    args: {},
    options: { refetchInterval: 10000 },
  });

  const proposalDescription = proposalDetailQuery?.data?.description ?? '';

  const expiryDateTimestamp = useMemo(() => {
    if (!proposalDetailQuery.data) {
      return 0;
    }
    let timestamp = 0;
    if ('at_time' in proposalDetailQuery.data.expires) {
      timestamp = Number(proposalDetailQuery.data.expires.at_time) / 1e6;
    }
    if ('at_height' in proposalDetailQuery.data.expires) {
      timestamp = Number(proposalDetailQuery.data.expires.at_height * 5);
    }

    return timestamp;
  }, [proposalDetailQuery.data]);

  const threshold = useMemo(() => {
    /// @ts-ignore
    return proposalDetailQuery?.data?.threshold?.absolute_count;
  }, [proposalDetailQuery?.data?.threshold]);

  const target = threshold ? threshold.weight : 0;
  const yesPercentage = useMemo(() => {
    return (
      votesQuery?.data?.votes.reduce((acc, vote) => {
        if (vote.vote === 'yes') {
          return acc + vote.weight;
        }
        return acc;
      }, 0) ?? 0
    );
  }, [votesQuery?.data?.votes]);

  const noPercentage = useMemo(() => {
    return (
      votesQuery?.data?.votes.reduce((acc, vote) => {
        if (vote.vote === 'no') {
          return acc + vote.weight;
        }
        return acc;
      }, 0) ?? 0
    );
  }, [votesQuery?.data?.votes]);

  const isGov = useMemo(
    () =>
      proposalDetailQuery?.data
        ? isProposalGov(proposalDetailQuery.data, goverrnanceQueryClient)
        : undefined,
    [proposalDetailQuery?.data, goverrnanceQueryClient],
  );

  const myVotingInfo = votersQuery?.data?.voters.filter(
    voter => voter.addr === (address as string),
  ) ?? [{ weight: 0 }];
  const myVotingPower = myVotingInfo[0]?.weight;

  const passed = proposalDetailQuery?.data?.status === 'passed';
  const myVote = useMemo(() => {
    const myVote =
      votesQuery?.data?.votes.filter(
        vote => vote.voter === (address as string),
      ) ?? [];
    if (myVote.length === 0) {
      return undefined;
    }
    return myVote[0]?.vote === 'yes';
  }, [votesQuery?.data?.votes, address]);

  const refetchData = () => {
    return Promise.all([
      proposalDetailQuery.refetch(),
      votesQuery.refetch(),
      votersQuery.refetch(),
    ]);
  };
  const voters = useMemo(() => {
    const members = daoMembers?.data?.voters ?? [];
    const memberVoted = votesQuery?.data?.votes ?? [];
    return members
      ?.sort((a, b) => b.weight - a.weight)
      ?.map(member => {
        const vote = memberVoted.find(vote => vote.voter === member.addr);
        return {
          ...member,
          voter: member.addr,
          vote: vote?.vote as string,
        };
      });
  }, [daoMembers?.data?.voters, votesQuery?.data?.votes]);

  const status = useMemo(
    () => proposalDetailQuery?.data?.status,
    [proposalDetailQuery?.data?.status],
  );

  const label = useMemo(() => {
    return getLabel({
      proposal: proposalDetailQuery?.data,
      yesVotes: yesPercentage,
      threshold,
    });
  }, [proposalDetailQuery.data, yesPercentage, threshold]);

  return (
    <>
      <Flex height={'47px'} />
      <ProposalHeader
        title={selectedDaoName}
        daoName={selectedDaoName}
        proposalTitle={proposalDetailQuery?.data?.title ?? ''}
        proposalExpiry={expiryDateTimestamp}
      />
      {(proposalDetailQuery.isLoading || proposalDetailQuery.isFetching) &&
        !proposalDetailQuery?.data && (
          <Center marginTop={'80px'}>
            <CircularProgress isIndeterminate color="darkPurple" />
          </Center>
        )}

      {proposalDetailQuery.data && (
        <HStack spacing="54px" align="flex-start">
          <Box flexGrow={1} cursor="pointer">
            <ProposalVoting
              noPercentage={noPercentage}
              yesPercentage={yesPercentage}
              target={target}
              childrenAtTheBottom={
                <DaoProposalFunding proposal={proposalDetailQuery?.data} />
              }
              label={
                label
                  ? { label: label.label, success: label.labelSuccess }
                  : undefined
              }
            >
              <GovProposalType
                client={client}
                proposal={proposalDetailQuery?.data}
              />
            </ProposalVoting>

            <GetProposalDetail
              client={client}
              proposal={proposalDetailQuery.data}
            />
            <Text color="purple" mt="4">
              Description
            </Text>
            <AutoResizeTextarea
              background="background.100"
              borderRadius="12px"
              padding="14px 16px"
              marginTop="10px"
              height="300px"
              fontSize="16px"
              fontWeight="normal"
              color="purple"
              fontFamily="DM Sans"
              borderWidth={1}
              borderStyle="solid"
              borderColor="background.500"
              isReadOnly
            >
              {proposalDescription}
            </AutoResizeTextarea>

            <ProposalExcuteRawData proposal={proposalDetailQuery.data} />
          </Box>
          <VStack width="330px" spacing="30px" align="flex-start">
            <ProposalMyVote
              disableExcuteTooltip={disableExcute}
              refetch={refetchData}
              executed={status === 'executed'}
              hideExecute={!(status !== 'executed' && target <= yesPercentage)}
              disableExecute={!!isGov && !!disableExcute}
              myVotingPower={myVotingPower}
              passed={passed}
              voted={myVote}
              dao={selectedDao}
              proposalId={selectedDaoProposalId}
            />
            <DirectoresList
              voters={voters ?? []}
              loading={votersQuery.isFetching}
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
