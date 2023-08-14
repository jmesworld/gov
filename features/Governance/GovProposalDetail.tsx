import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Spinner,
  Text,
  Tooltip,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useChain } from '@cosmos-kit/react';

import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import {
  GovernanceClient,
  GovernanceQueryClient,
} from '../../client/Governance.client';
import { useGovernanceProposalQuery } from '../../client/Governance.react-query';

import { chainName } from '../../config/defaults';
import GovProposalMyVote from './GovProposalMyVote';
import {
  ProposalHeadingContainer,
  ProposalVotingWithStatus,
} from './GovProposalVoting';
import { ProposalHeader } from '../components/Proposal/ProposalHeader';
import { useCosmWasmClientContext } from '../../contexts/CosmWasmClient';
import { calculateVotes } from '../../lib/calculateVotes';
import { useVotingPeriodContext } from '../../contexts/VotingPeriodContext';
import { useSigningCosmWasmClientContext } from '../../contexts/SigningCosmWasmClient';
import { useRouter } from 'next/router';
import { ProposalExcuteRawData } from '../Dao/Proposal/Components/ProposalRawData';
import { ProposalFunding } from './ProposalFunding';
import { GetSlotType, GovProposalType } from '../Governance/ProposalType';
import { useDao, useDaoMemberList } from '../../hooks/dao';
import DirectoresList from '../Dao/Proposal/Components/DirectorsList';
import { getAttribute } from '../../utils/tx';
import { handleError } from '../../error/hanldeErrors';
import { AutoResizeTextarea } from '../components/genial/ResizableInput';

const GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export default function GovProposalDetail({
  proposalId,
}: {
  proposalId: number;
}) {
  const { query } = useRouter();
  const { data: periodData } = useVotingPeriodContext();
  const toast = useToast();
  const { cosmWasmClient } = useCosmWasmClientContext();
  const { signingCosmWasmClient } = useSigningCosmWasmClientContext();
  const { isPostingPeriod, nextPeriodTimeLeft } = useVotingPeriodContext();
  const { address } = useChain(chainName);
  const [concluding, setConcluding] = useState(false);
  const [daoProposalId, setDaoProposalId] = useState<number | undefined>(
    undefined,
  );
  const govQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    GOVERNANCE_CONTRACT,
  );

  const tab = query.tab;

  const { data, refetch } = useGovernanceProposalQuery({
    client: govQueryClient,
    args: {
      id: proposalId,
    },
    options: {
      enabled: !!cosmWasmClient && !!proposalId && !!govQueryClient,
      refetchInterval: 10000,
    },
  });
  useEffect(() => {
    cosmWasmClient
      ?.searchTx({
        tags: [
          {
            key: 'wasm.gov_proposal_id',
            value: proposalId.toString(),
          },
        ],
      })
      .then(res => {
        const daoProposalId = getAttribute(res[0], 'wasm', 'proposal_id');

        if (daoProposalId === undefined) {
          return;
        }
        setDaoProposalId(Number(daoProposalId));
      });
  }, [address, cosmWasmClient, proposalId]);

  const { data: daoInfo } = useDao(data?.dao);
  const { voters: memberListWithVote, isFetching: daoMemberListLoading } =
    useDaoMemberList(data?.dao, daoProposalId);

  const govMutationClient = useMemo(
    () =>
      signingCosmWasmClient && address
        ? new GovernanceClient(
            signingCosmWasmClient,
            address as string,
            GOVERNANCE_CONTRACT,
          )
        : null,
    [signingCosmWasmClient, address],
  );
  // TODO: make sure this works
  const proposalExpired = useMemo(() => {
    if (!periodData || !data?.start_block) {
      return false;
    }
    if (periodData.current_period === 'posting') {
      return (
        periodData.current_block - periodData.current_time_in_cycle / 5 >
        data?.start_block
      );
    }
    return (
      periodData.current_block >=
      data?.start_block + periodData.cycle_length / 5
    );
  }, [periodData, data?.start_block]);
  const proposalDescription = data?.description ?? '';
  const expiryDateTimestamp = data?.voting_end ?? 0;

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
        totalSupply: (Number(data?.coins_total) || 0) / 1e6,
      }),
    [data?.coins_no, data?.coins_total, data?.coins_yes],
  );

  const isPassing = useMemo(() => {
    if (thresholdPercent === undefined || yesPercentage === undefined) {
      return undefined;
    }
    return thresholdPercent <= yesPercentage ? 'Passing' : 'pending';
  }, [thresholdPercent, yesPercentage]);

  const passed = useMemo(() => {
    if (data?.status === 'success' || data?.status === 'success_concluded') {
      return true;
    }
    if (data?.status === 'expired' || data?.status === 'expired_concluded') {
      return false;
    }
    return undefined;
  }, [data?.status]);

  const label = useMemo(() => {
    if (passed !== undefined) {
      return {
        label: passed ? 'Passed' : 'Failed',
        success: passed,
      };
    }
    if (isPassing !== undefined) {
      return {
        label: isPassing,
        success: isPassing === 'Passing',
      };
    }
    return undefined;
  }, [passed, isPassing]);

  const votedYes = useMemo(() => {
    return data?.yes_voters?.includes(address as string);
  }, [data?.yes_voters, address]);

  const votedNo = useMemo(() => {
    return data?.no_voters?.includes(address as string);
  }, [data?.no_voters, address]);

  const voted = useMemo(() => {
    return votedYes || votedNo;
  }, [votedYes, votedNo]);
  const concludeVote = async () => {
    try {
      setConcluding(true);
      await govMutationClient?.conclude({
        id: proposalId,
      });
      await refetch();
      toast({
        title: 'Concluded Vote',
        status: 'success',
        variant: 'custom',
        isClosable: true,
      });
      setConcluding(false);
    } catch (err) {
      handleError(err, 'Error concluding vote.', toast);
    }
    setConcluding(false);
  };

  const status = useMemo(() => {
    return data?.status;
  }, [data?.status]);

  const proposalTitle = useMemo(() => {
    if (tab === 'core-slots') {
      return 'Core Slot Proposal';
    }
    if (tab === 'archived') {
      return 'Archived Proposal';
    }
    if (tab === 'funded') {
      return 'Funded Proposal';
    }
    return 'Governance Proposal';
  }, [tab]);

  const tabLink = useMemo(() => {
    if (tab === 'core-slots') {
      return '/core-slots';
    }
    if (tab === 'archived') {
      return '/archived';
    }
    if (tab === 'funded') {
      return '/funded';
    }
    return undefined;
  }, [tab]);
  return (
    <>
      <Flex height={'47px'} />
      <ProposalHeader
        tab={tabLink}
        title={proposalTitle}
        proposalTitle={data?.title ?? ''}
        proposalExpiry={expiryDateTimestamp * 1e3}
      />
      {data ? (
        <HStack spacing="54px" align="flex-start">
          <Box flexGrow={1}>
            <ProposalHeadingContainer>
              <GovProposalType daoName={daoInfo?.dao_name} proposal={data} />
              <ProposalVotingWithStatus
                yesCount={coinYes}
                noCount={coinNo}
                yesPercent={yesPercentage}
                noPercent={noPercentage}
                targetPercentage={thresholdPercent}
                target={Number(threshold) || 0}
                yesVotesPercentage={yesPercentage}
                noVotesPercentage={noPercentage}
                label={label}
              />

              <ProposalFunding proposal={data} />
            </ProposalHeadingContainer>
            <GetSlotType proposal={data} />
            <Text mt="15px" color="purple">
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

            <ProposalExcuteRawData proposal={data} />
          </Box>
          <VStack
            width="330px"
            pos="relative"
            height="full"
            spacing="30px"
            align="flex-start"
          >
            <GovProposalMyVote
              refetch={refetch}
              voted={!!voted}
              proposalId={proposalId}
            >
              {isPostingPeriod &&
                !proposalExpired &&
                (status === 'voting' || status === 'posted') && (
                  <Box
                    backdropFilter="auto"
                    backdropBlur="3px"
                    p="4"
                    width="full"
                    h="full"
                    m="auto"
                    zIndex="3"
                    bg="purple"
                    pos="absolute"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDir="column"
                  >
                    <Text fontSize="xl" textAlign="center">
                      Please wait until the voting starts.
                    </Text>
                    <Text textAlign="center">{nextPeriodTimeLeft}</Text>
                  </Box>
                )}
              {voted &&
                !proposalExpired &&
                (status === 'voting' || status === 'posted') && (
                  <Box
                    backdropFilter="auto"
                    backdropBlur="3px"
                    p="4"
                    width="full"
                    h="full"
                    m="auto"
                    zIndex="3"
                    bg="purple"
                    pos="absolute"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="xl" textAlign="center">
                      Thank you for your
                      <Badge
                        backgroundColor={votedYes ? 'green' : 'red'}
                        mx="5px"
                        rounded="full"
                        color="black"
                        px="3"
                        py="1"
                        fontSize={12}
                      >
                        {votedYes ? 'Yes' : 'No'}
                      </Badge>
                      Vote.
                    </Text>
                  </Box>
                )}

              {(status === 'voting' || status === 'posted') &&
                proposalExpired &&
                yesPercentage < thresholdPercent &&
                isPostingPeriod && (
                  <Box
                    backdropFilter="auto"
                    backdropBlur="3px"
                    p="4"
                    width="full"
                    h="full"
                    m="auto"
                    zIndex="3"
                    bg="purple"
                    pos="absolute"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDir="column"
                  >
                    <Text fontSize="xl" textAlign="center">
                      Proposal expired
                    </Text>
                  </Box>
                )}
              {(status === 'voting' || status === 'posted') &&
                proposalExpired &&
                yesPercentage > thresholdPercent && (
                  <Box
                    backdropFilter="auto"
                    backdropBlur="3px"
                    p="4"
                    width="full"
                    h="full"
                    m="auto"
                    zIndex="3"
                    bg="purple"
                    pos="absolute"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDir="column"
                  >
                    <Text fontSize="xl" textAlign="center">
                      Proposal passed
                    </Text>
                  </Box>
                )}
              {!(status === 'voting' || status === 'posted') && (
                <Box
                  backdropFilter="auto"
                  backdropBlur="3px"
                  p="4"
                  width="full"
                  h="full"
                  m="auto"
                  zIndex="3"
                  bg="purple"
                  pos="absolute"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {(status === 'expired' || status === 'expired_concluded') && (
                    <Text fontSize="xl" textAlign="center">
                      Proposal expired
                    </Text>
                  )}

                  {((proposalExpired && yesPercentage >= thresholdPercent) ||
                    status === 'success' ||
                    status === 'success_concluded') && (
                    <Text fontSize="xl" textAlign="center">
                      Proposal passed
                    </Text>
                  )}
                </Box>
              )}
            </GovProposalMyVote>
            {(status === 'expired' || status === 'success') && (
              <Tooltip
                hasArrow
                label="Please connect your wallet to participate in governance"
                isDisabled={!!address}
              >
                <Button
                  disabled={concluding || !address}
                  mt="37px"
                  as="button"
                  height="48px"
                  width="100%"
                  lineHeight="16px"
                  border="1px"
                  borderRadius="90px"
                  fontSize="14px"
                  fontWeight="medium"
                  bg="#A1F0C4"
                  borderColor="#91D8B0"
                  loadingText="Concluding"
                  color="#0F0056"
                  fontFamily="DM Sans"
                  onClick={concludeVote}
                  isLoading={concluding}
                >
                  Conclude
                </Button>
              </Tooltip>
            )}

            <DirectoresList
              voters={memberListWithVote ?? []}
              loading={daoMemberListLoading}
            />
          </VStack>
        </HStack>
      ) : (
        <Center w="full" h="full" marginTop={'80px'}>
          <Spinner size="lg" />
        </Center>
      )}
    </>
  );
}
