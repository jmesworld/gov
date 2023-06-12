import {
  Box,
  Center,
  CircularProgress,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useChain } from "@cosmos-kit/react";

import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { GovernanceQueryClient } from "../../client/Governance.client";
import { useGovernanceProposalQuery } from "../../client/Governance.react-query";

import { chainName } from "../../config/defaults";
import GovProposalMyVote from "./GovProposalMyVote";
import GovProposalVoting from "./GovProposalVoting";
import { ProposalHeader } from "../components/Proposal/ProposalHeader";

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export default function GovProposalDetail({
  proposalId,
}: {
  proposalId: number;
}) {
  const { address, status, getCosmWasmClient, getSigningCosmWasmClient } =
    useChain(chainName);

  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null);
  useEffect(() => {
    if (address) {
      getCosmWasmClient()
        .then((cosmWasmClient) => {
          if (!cosmWasmClient) {
            return;
          }
          setCosmWasmClient(cosmWasmClient);
        })
        .catch((error) => console.log(error));

      getSigningCosmWasmClient()
        .then((signingClient) => {
          if (!signingClient) {
            return;
          }
          setSigningClient(signingClient);
        })
        .catch((error) => console.log(error));
    }
  }, [address, getCosmWasmClient]);

  const govQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    GOVERNANCE_CONTRACT
  );

  const proposalDetailQuery = useGovernanceProposalQuery({
    client: govQueryClient,
    args: {
      id: proposalId,
    },
    options: {
      refetchInterval: 10,
    },
  });

  const proposalDescription = proposalDetailQuery?.data?.description ?? "";
  const expiryDate = proposalDetailQuery?.data?.voting_end ?? 0;
  const expiryDateTimestamp = !!proposalDetailQuery?.data
    ? expiryDate * 1000
    : -1;

  console.log(expiryDate);
  const threshold = "10.00"; //TODO: confirm threshold for Governance proposals
  const target = !!proposalDetailQuery?.data ? parseFloat(threshold) : 0;

  const yesVotesCount = proposalDetailQuery?.data?.yes_voters.length ?? 0;
  const noVotesCount = proposalDetailQuery?.data?.no_voters.length ?? 0;
  const total =
    parseInt(proposalDetailQuery?.data?.coins_yes as string) +
      parseInt(proposalDetailQuery?.data?.coins_no as string) ?? 100;
  const yesVotesPercentage =
    (total > 0
      ? parseInt(proposalDetailQuery?.data?.coins_yes as string) / total
      : 0) * 100;
  const noVotesPercentage =
    (total > 0
      ? parseInt(proposalDetailQuery?.data?.coins_no as string) / total
      : 0) * 100;

  const voted =
    (proposalDetailQuery?.data?.yes_voters?.includes(address as string) ||
      proposalDetailQuery?.data?.no_voters?.includes(address as string)) ??
    false;

  return (
    <>
      <Flex height={"47px"} />
      <ProposalHeader
        daoName={"Governance Proposal"}
        proposalTitle={proposalDetailQuery?.data?.title ?? ""}
        proposalExpiry={expiryDateTimestamp}
      />
      {!!proposalDetailQuery.data ? (
        <HStack spacing="54px" align="flex-start">
          <Box flexGrow={1}>
            <GovProposalVoting
              target={target}
              yesVotesCount={yesVotesCount}
              noVotesCount={noVotesCount}
              yesVotesPercentage={yesVotesPercentage}
              noVotesPercentage={noVotesPercentage}
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
            <GovProposalMyVote voted={voted} proposalId={proposalId} />
            {/* <ProposalDaoMembers
              selectedDaoMembersList={daoMembers}
            /> */}
          </VStack>
        </HStack>
      ) : (
        <Center marginTop={"80px"}>
          <CircularProgress isIndeterminate color="darkPurple" />
        </Center>
      )}
    </>
  );
}
