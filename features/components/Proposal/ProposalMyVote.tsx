import {
  Box,
  Text,
  ButtonGroup,
  Button,
  useToast,
  CircularProgress,
  Flex,
  Tooltip,
} from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react';

import { useState } from 'react';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

import { StdFee } from '@cosmjs/amino';
import { DaoMultisigClient } from '../../../client/DaoMultisig.client';
import {
  useDaoMultisigVoteMutation,
  useDaoMultisigExecuteMutation,
} from '../../../client/DaoMultisig.react-query';
import { chainName } from '../../../config/defaults';
import { useSigningCosmWasmClientContext } from '../../../contexts/SigningCosmWasmClient';

const fee: StdFee = {
  amount: [{ amount: '30000', denom: 'ujmes' }],
  gas: '10000000',
};

export interface ProposalMyVoteType {
  myVotingPower: number;
  voted: boolean;
  passed: boolean;
  dao: string;
  proposalId: number;
  hideExecute: boolean;
  disableExecute: boolean;
  disableExcuteTooltip?: string;
  refetch: () => Promise<unknown>;
}

export const ProposalMyVote = (props: ProposalMyVoteType) => {
  const toast = useToast();
  const { address } = useChain(chainName);
  const [isSubmittingYesVote, setSubmittingYesVote] = useState(false);
  const [isSubmittingNoVote, setSubmittingNoVote] = useState(false);
  const [isSubmittingExecuteVote, setSubmittingExecuteVote] = useState(false);
  const { signingCosmWasmClient: signingClient } =
    useSigningCosmWasmClientContext();

  const daoMultisigClient = new DaoMultisigClient(
    signingClient as SigningCosmWasmClient,
    address as string,
    props.dao,
  );

  const voteMutation = useDaoMultisigVoteMutation();
  const executeMutation = useDaoMultisigExecuteMutation();

  return (
    <Box w="full">
      <Box
        borderRadius="12px"
        backgroundColor="#7453FD"
        padding="14px 16px"
        width="100%"
      >
        <Text
          color="#fff"
          fontSize={16}
          fontWeight="medium"
          fontFamily="DM Sans"
        >
          Please Vote...
        </Text>
        <Flex w="full" justifyContent="flex-start" alignItems="center">
          <Text
            color="#fff"
            fontSize={16}
            fontWeight="medium"
            fontFamily="DM Sans"
          >
            My Voting Power:
          </Text>
          <Text
            ml="20px"
            fontSize="24px"
            fontWeight="normal"
            color="#fff"
            fontFamily="DM Sans"
          >
            {props.myVotingPower}%
          </Text>
        </Flex>

        <ButtonGroup
          gap="6px"
          width="100%"
          marginTop="20px"
          marginBottom="10px"
          isDisabled={props.voted}
        >
          <Button
            as="button"
            height="42px"
            width="50%"
            lineHeight="16px"
            border="1px"
            borderRadius="90px"
            fontSize="14px"
            fontWeight="medium"
            bg="#A1F0C4"
            borderColor="#91D8B0"
            color="#0F0056"
            fontFamily="DM Sans"
            onClick={() => {
              setSubmittingYesVote(true);
              voteMutation
                .mutateAsync({
                  client: daoMultisigClient,
                  msg: {
                    proposalId: props.proposalId,
                    vote: 'yes',
                  },
                  args: { fee },
                })
                .then(() => props.refetch())
                .then(() => {
                  toast({
                    title: 'Vote submitted.',
                    description: "We've submitted your Vote.",
                    status: 'success',
                    variant: 'custom',
                    duration: 9000,
                    isClosable: true,
                  });
                })
                .catch(error => {
                  toast({
                    title: 'Vote creation error',
                    description: error.toString(),
                    status: 'error',
                    variant: 'custom',
                    duration: 9000,
                    isClosable: true,
                  });
                })
                .finally(() => setSubmittingYesVote(false));
            }}
          >
            {!isSubmittingYesVote ? (
              <Text
                color="midnight"
                fontFamily={'DM Sans'}
                fontWeight="medium"
                fontSize={14}
              >
                Yes
              </Text>
            ) : (
              <CircularProgress
                isIndeterminate
                size={'24px'}
                color="midnight"
              />
            )}
          </Button>
          <Button
            as="button"
            height="42px"
            width="50%"
            lineHeight="16px"
            border="1px"
            borderRadius="90px"
            fontSize="14px"
            fontWeight="medium"
            bg="#FF5876"
            borderColor="#E54F6A"
            color="#fff"
            fontFamily="DM Sans"
            onClick={() => {
              setSubmittingNoVote(true);
              voteMutation
                .mutateAsync({
                  client: daoMultisigClient,
                  msg: {
                    proposalId: props.proposalId,
                    vote: 'no',
                  },
                  args: { fee },
                })
                .then(() => props.refetch())
                .then(() => {
                  toast({
                    title: 'Vote submitted.',
                    description: "We've submitted your Vote.",
                    status: 'success',
                    variant: 'custom',
                    duration: 9000,
                    isClosable: true,
                  });
                })
                .catch(error => {
                  toast({
                    title: 'Vote creation error',
                    description: error.toString(),
                    status: 'error',
                    variant: 'custom',
                    duration: 9000,
                    isClosable: true,
                  });
                })
                .finally(() => setSubmittingNoVote(false));
            }}
          >
            {!isSubmittingNoVote ? (
              <Text
                color="midnight"
                fontFamily={'DM Sans'}
                fontWeight="medium"
                fontSize={14}
              >
                No
              </Text>
            ) : (
              <CircularProgress
                isIndeterminate
                size={'24px'}
                color="midnight"
              />
            )}
          </Button>
        </ButtonGroup>
      </Box>
      {!props.hideExecute && (
        <Tooltip
          isDisabled={!props.disableExecute}
          hasArrow
          label={props.disableExcuteTooltip}
        >
          <Button
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
            isLoading={isSubmittingExecuteVote}
            disabled={props.disableExecute}
            loadingText="Executing..."
            color="#0F0056"
            fontFamily="DM Sans"
            onClick={() => {
              setSubmittingExecuteVote(true);
              executeMutation
                .mutateAsync({
                  client: daoMultisigClient,
                  msg: {
                    proposalId: props.proposalId,
                  },
                  args: { fee },
                })
                .then(() => props.refetch())
                .then(() => {
                  toast({
                    title: 'Proposal executed!',
                    status: 'success',
                    variant: 'custom',
                    duration: 9000,
                    isClosable: true,
                  });
                })
                .catch(error => {
                  toast({
                    title: 'Proposal execution error',
                    description: error.toString(),
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    variant: 'custom',
                  });
                })
                .finally(() => setSubmittingExecuteVote(false));
            }}
          >
            Execute
          </Button>
        </Tooltip>
      )}
    </Box>
  );
};
