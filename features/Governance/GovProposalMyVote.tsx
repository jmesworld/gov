import {
  Box,
  Text,
  ButtonGroup,
  Button,
  useToast,
  CircularProgress,
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../config/defaults";
import { useEffect, useState } from "react";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DaoMultisigClient } from "../../client/DaoMultisig.client";
import {
  useDaoMultisigExecuteMutation,
  useDaoMultisigVoteMutation,
} from "../../client/DaoMultisig.react-query";
import { StdFee } from "@cosmjs/amino";
import { GovernanceClient } from "../../client/Governance.client";
import { useGovernanceVoteMutation } from "../../client/Governance.react-query";

const fee: StdFee = {
  amount: [{ amount: "30000", denom: "ujmes" }],
  gas: "10000000",
};

const GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export interface GovProposalMyVote {
  voted: boolean;
  proposalId: number;
}

const GovProposalMyVote = (props: GovProposalMyVote) => {
  const toast = useToast();
  const { address, status, getSigningCosmWasmClient } = useChain(chainName);
  const [isSubmittingYesVote, setSubmittingYesVote] = useState(false);
  const [isSubmittingNoVote, setSubmittingNoVote] = useState(false);
  const [isSubmittingExecuteVote, setSubmittingExecuteVote] = useState(false);

  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null);
  useEffect(() => {
    if (address) {
      getSigningCosmWasmClient()
        .then((signingClient) => {
          if (!signingClient) {
            return;
          }
          setSigningClient(signingClient);
        })
        .catch((error) => console.log(error));
    }
  }, [address, getSigningCosmWasmClient]);

  const daoMultisigClient = new GovernanceClient(
    signingClient as SigningCosmWasmClient,
    address as string,
    GOVERNANCE_CONTRACT
  );

  const voteMutation = useGovernanceVoteMutation();

  return (
    <Box
      borderRadius="12px"
      backgroundColor="#7453FD"
      padding="14px 16px"
      width="100%"
    >
      <Text color="#fff" fontSize={16} fontWeight="medium" fontFamily="DM Sans">
        Please vote:
      </Text>
      <ButtonGroup
        gap="6px"
        width="100%"
        marginTop="40px"
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
                  id: props.proposalId,
                  vote: "yes",
                },
                args: { fee },
              })
              .then((result) => {
                toast({
                  title: "Vote submitted.",
                  description: "We've submitted your Vote.",
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                  containerStyle: {
                    backgroundColor: "darkPurple",
                    borderRadius: 12,
                  },
                });
              })
              .catch((error) => {
                toast({
                  title: "Vote creation error",
                  description: error.toString(),
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                  containerStyle: {
                    backgroundColor: "red",
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
              fontFamily={"DM Sans"}
              fontWeight="medium"
              fontSize={14}
            >
              Yes
            </Text>
          ) : (
            <CircularProgress isIndeterminate size={"24px"} color="midnight" />
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
                  id: props.proposalId,
                  vote: "no",
                },
                args: { fee },
              })
              .then((result) => {
                toast({
                  title: "Vote submitted.",
                  description: "We've submitted your Vote.",
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                  containerStyle: {
                    backgroundColor: "darkPurple",
                    borderRadius: 12,
                  },
                });
              })
              .catch((error) => {
                toast({
                  title: "Vote creation error",
                  description: error.toString(),
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                  containerStyle: {
                    backgroundColor: "red",
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
              fontFamily={"DM Sans"}
              fontWeight="medium"
              fontSize={14}
            >
              No
            </Text>
          ) : (
            <CircularProgress isIndeterminate size={"24px"} color="midnight" />
          )}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default GovProposalMyVote;
