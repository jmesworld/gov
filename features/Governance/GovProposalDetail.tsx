import {
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
import { useMemo, useState } from 'react';
import { useChain } from '@cosmos-kit/react';

import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import {
  GovernanceClient,
  GovernanceQueryClient,
} from '../../client/Governance.client';
import { useGovernanceProposalQuery } from '../../client/Governance.react-query';

import { chainName } from '../../config/defaults';
import GovProposalMyVote from './GovProposalMyVote';
import GovProposalVoting from './GovProposalVoting';
import { ProposalHeader } from '../components/Proposal/ProposalHeader';
import { useCosmWasmClientContext } from '../../contexts/CosmWasmClient';
import { calculateVotes } from '../../lib/calculateVotes';
import { useVotingPeriodContext } from '../../contexts/VotingPeriodContext';
import { useSigningCosmWasmClientContext } from '../../contexts/SigningCosmWasmClient';

const GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export default function GovProposalDetail({
  proposalId,
}: {
  proposalId: number;
}) {
  const { data: periodData } = useVotingPeriodContext();
  const toast = useToast();
  const { cosmWasmClient } = useCosmWasmClientContext();
  const { signingCosmWasmClient } = useSigningCosmWasmClientContext();
  const { isPostingPeriod, nextPeriodTimeLeft } = useVotingPeriodContext();
  const { address } = useChain(chainName);
  const [concluding, setConcluding] = useState(false);
  const govQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    GOVERNANCE_CONTRACT,
  );

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
  // TODO: finish this
  const proposalExpired = useMemo(() => {
    if (!periodData || !data?.start_block) {
      return false;
    }
    return (
      periodData.current_block + periodData.voting_period_length / 5 >=
      data?.start_block + periodData.cycle_length / 5
    );
  }, [periodData, data?.start_block]);

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
        totalSupply: (Number(data?.coins_total) || 0) / 1e6,
      }),
    [data?.coins_no, data?.coins_total, data?.coins_yes],
  );

  const isPassing = useMemo(() => {
    if (thresholdPercent === undefined || yesPercentage === undefined) {
      return undefined;
    }
    return thresholdPercent <= yesPercentage ? 'Passing' : 'Failing';
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
        description: "We've concluded the vote.",
        status: 'success',
        variant: 'custom',
        isClosable: true,
      });
      setConcluding(false);
    } catch (err) {
      if (err instanceof Error)
        toast({
          title: 'Error',
          description: err.message,
          status: 'error',
          variant: 'custom',
          isClosable: true,
        });
    }
    setConcluding(false);
  };

  const status = useMemo(() => {
    return data?.status;
  }, [data?.status]);
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
              target={Number(threshold) || 0}
              yesVotesPercentage={yesPercentage}
              noVotesPercentage={noPercentage}
              label={label}
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
            <GovProposalMyVote
              refetch={refetch}
              voted={!!voted}
              proposalId={proposalId}
            >
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
                      {votedYes
                        ? 'Thank you for your Yes Vote.'
                        : 'You you for your No Vote.'}
                    </Text>
                  </Box>
                )}

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
              {(status === 'voting' || status === 'posted') &&
                proposalExpired &&
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

                  {(status === 'success' || status === 'success_concluded') && (
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
