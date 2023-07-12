import {
  Box,
  Text,
  ButtonGroup,
  Button,
  useToast,
  CircularProgress,
  Tooltip,
} from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react';
import { chainName } from '../../config/defaults';
import { ReactNode, useState } from 'react';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

import { StdFee } from '@cosmjs/amino';
import { GovernanceClient } from '../../client/Governance.client';
import { useGovernanceVoteMutation } from '../../client/Governance.react-query';
import { useSigningCosmWasmClientContext } from '../../contexts/SigningCosmWasmClient';

const fee: StdFee = {
  amount: [{ amount: '30000', denom: 'ujmes' }],
  gas: '10000000',
};

const GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export interface Props {
  voted: boolean;
  proposalId: number;
  children?: ReactNode;
}

const GovProposalMyVote = (props: Props) => {
  const toast = useToast();
  const { address } = useChain(chainName);
  const [isSubmittingYesVote, setSubmittingYesVote] = useState(false);
  const [isSubmittingNoVote, setSubmittingNoVote] = useState(false);

  const { signingCosmWasmClient: signingClient } =
    useSigningCosmWasmClientContext();

  const daoMultisigClient = new GovernanceClient(
    signingClient as SigningCosmWasmClient,
    address as string,
    GOVERNANCE_CONTRACT,
  );

  const voteMutation = useGovernanceVoteMutation();

  return (
    <Box
      borderRadius="12px"
      overflow="hidden"
      backgroundColor="#7453FD"
      width="100%"
      pos="relative"
    >
      {props.children}
      <Box padding="14px 16px">
        <Text
          color="#fff"
          fontSize={16}
          fontWeight="medium"
          fontFamily="DM Sans"
        >
          Please vote:
        </Text>
        <ButtonGroup
          gap="6px"
          width="100%"
          marginTop="40px"
          isDisabled={props.voted}
        >
          <Tooltip
            hasArrow
            isDisabled={!!address}
            label="Please connect your wallet to participate in governance"
          >
            <Button
              disabled={!address}
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
                      id: props.proposalId,
                      vote: 'yes',
                    },
                    args: { fee },
                  })
                  .then(() => {
                    toast({
                      title: 'Vote submitted.',
                      description: "We've submitted your Vote.",
                      status: 'success',
                      duration: 9000,
                      isClosable: true,
                      containerStyle: {
                        backgroundColor: 'darkPurple',
                        borderRadius: 12,
                      },
                    });
                  })
                  .catch(error => {
                    toast({
                      title: 'Vote creation error',
                      description: error.toString(),
                      status: 'error',
                      duration: 9000,
                      isClosable: true,
                      containerStyle: {
                        backgroundColor: 'red',
                        borderRadius: 12,
                      },
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
          </Tooltip>
          <Tooltip
            hasArrow
            isDisabled={!!address}
            label="Please connect your wallet to participate in governance"
          >
            <Button
              disabled={!address}
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
                      id: props.proposalId,
                      vote: 'no',
                    },
                    args: { fee },
                  })
                  .then(() => {
                    toast({
                      title: 'Vote submitted.',
                      description: "We've submitted your Vote.",
                      status: 'success',
                      duration: 9000,
                      isClosable: true,
                      containerStyle: {
                        backgroundColor: 'darkPurple',
                        borderRadius: 12,
                      },
                    });
                  })
                  .catch(error => {
                    toast({
                      title: 'Vote creation error',
                      description: error.toString(),
                      status: 'error',
                      duration: 9000,
                      isClosable: true,
                      containerStyle: {
                        backgroundColor: 'red',
                        borderRadius: 12,
                      },
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
          </Tooltip>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default GovProposalMyVote;
