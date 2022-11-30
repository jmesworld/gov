import Head from "next/head";
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  Grid,
  useColorModeValue,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { LCDClient } from "@terra-money/terra.js/dist/client/lcd/LCDClient";
import { useMutation } from "@tanstack/react-query";
import { Extension, MsgExecuteContract } from "@terra-money/terra.js";
import { useRouter } from "next/router";
import { DaoMultisigQueryClient } from "../client/DaoMultisig.client";
import {
  useDaoMultisigListVotesQuery,
  useDaoMultisigProposalQuery,
} from "../client/DaoMultisig.react-query";
import { GovernanceQueryClient } from "../client/Governance.client";
import {
  useGovernanceProposalQuery,
  useGovernanceProposalsQuery,
} from "../client/Governance.react-query";
import { ExecuteMsg, VoteOption } from "../client/Governance.types";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../client/Identityservice.react-query";
import { DistributionQueryClient } from "../client/Distribution.client";
import {
  useDistributionGrantQuery,
  useDistributionGrantsQuery,
} from "../client/Distribution.react-query";
import * as Distribution from "../client/Distribution.types";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;
const NEXT_PUBLIC_DISTRIBUTION_CONTRACT = process.env
  .NEXT_PUBLIC_DISTRIBUTION_CONTRACT as string;

export default function GovProposalDetail() {
  const router = useRouter();
  const proposalId = router.query.id;
  const daoAddress = router.query.address;

  let vote = "";

  const toast = useToast();
  const walletManager = useWallet();
  const {
    connect,
    walletStatus,
    username,
    address,
    message,
    currentChainName,
    currentWallet,
  } = walletManager;

  const LCDOptions = {
    URL: LCD_URL,
    chainID: CHAIN_ID,
  };

  const lcdClient = new LCDClient(LCDOptions);
  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    lcdClient,
    IDENTITY_SERVICE_CONTRACT
  );

  const governanceQueryClient = new GovernanceQueryClient(
    lcdClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT
  );

  const distributionQueryClient = new DistributionQueryClient(
    lcdClient,
    NEXT_PUBLIC_DISTRIBUTION_CONTRACT
  );

  const proposalQuery = useGovernanceProposalQuery({
    client: governanceQueryClient,
    args: { id: proposalId ? parseInt(proposalId as string) : 0 },
  });

  async function voteOnProposal() {
    const voteOption: VoteOption = vote as VoteOption;
    const msg: ExecuteMsg = {
      vote: {
        id: parseInt(proposalId as string),
        vote: voteOption,
      },
    };
    const execMsg = new MsgExecuteContract(
      address as string,
      NEXT_PUBLIC_GOVERNANCE_CONTRACT,
      msg
    );

    const txMsg = {
      msgs: [execMsg.toJSON(false)],
    };

    try {
      const ext = new Extension();
      const result = await ext.request(
        "post",
        JSON.parse(JSON.stringify(txMsg))
      );
      const payload = JSON.parse(JSON.stringify(result.payload));
      if (payload.success) {
        toast({
          title: "Vote created.",
          description: "We've created your Vote for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Vote creation error.",
          description: payload.error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      console.log(result);
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  const voteMutation = useMutation(["voteMutation"], voteOnProposal);

  async function concludeProposal() {
    const msg: ExecuteMsg = {
      conclude: {
        id: parseInt(proposalId as string),
      },
    };
    const execMsg = new MsgExecuteContract(
      address as string,
      NEXT_PUBLIC_GOVERNANCE_CONTRACT,
      msg
    );

    const txMsg = {
      msgs: [execMsg.toJSON(false)],
    };

    try {
      const ext = new Extension();
      const result = await ext.request(
        "post",
        JSON.parse(JSON.stringify(txMsg))
      );
      const payload = JSON.parse(JSON.stringify(result.payload));
      if (payload.success) {
        toast({
          title: "Proposal executed.",
          description: "We've executed your Proposal for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Proposal execution error.",
          description: payload.error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      console.log(result);
      return result;
    } catch (e) {
      console.error(e);
    }
  }
  const proposalConcludeMutation = useMutation(
    ["proposalConcludeMutation"],
    concludeProposal
  );

  const votingStarts =
    new Date(
      (proposalQuery.data?.voting_start as number) * 1000
    ).toLocaleDateString() +
    " " +
    new Date(
      (proposalQuery.data?.voting_start as number) * 1000
    ).toLocaleTimeString();
  const votingEnds =
    new Date(
      (proposalQuery.data?.voting_end as number) * 1000
    ).toLocaleDateString() +
    "  " +
    new Date(
      (proposalQuery.data?.voting_end as number) * 1000
    ).toLocaleTimeString();

  const daoIdentityQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client,
    args: {
      owner: proposalQuery.data?.dao as string,
    },
    options: {
      enabled: !!proposalQuery.data?.dao,
    },
  });

  // console.log(proposalQuery.data)

  const grantsQuery = useDistributionGrantsQuery({
    client: distributionQueryClient,
    args: {},
    options: {},
  });

  // const grant = grantsQuery.data?.grants.filter((grant) => grant.dao === )

  async function claimProposal() {
    const msg: Distribution.ExecuteMsg = {
      claim: {
        grant_id: 1,
      },
    };
    const execMsg = new MsgExecuteContract(
      address as string,
      NEXT_PUBLIC_GOVERNANCE_CONTRACT,
      msg
    );

    const txMsg = {
      msgs: [execMsg.toJSON(false)],
    };

    try {
      const ext = new Extension();
      const result = await ext.request(
        "post",
        JSON.parse(JSON.stringify(txMsg))
      );
      const payload = JSON.parse(JSON.stringify(result.payload));
      if (payload.success) {
        toast({
          title: "Proposal executed.",
          description: "We've executed your Proposal for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Proposal execution error.",
          description: payload.error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      console.log(result);
      return result;
    } catch (e) {
      console.error(e);
    }
  }
  const proposalClaimMutation = useMutation(
    ["proposalClaimMutation"],
    claimProposal
  );

  const prop_type = proposalQuery.data
    ? Object.keys(proposalQuery.data?.prop_type)[0]
    : "";

  const prop_type_info = proposalQuery.data
    ? Object.keys(
        JSON.parse(JSON.stringify(proposalQuery.data?.prop_type))[prop_type]
      )[0]
    : "";

  const prop_status = proposalQuery.data?.status;

  console.log(prop_status);
  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>JMES Governance App</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box textAlign="center">
        <Heading
          as="h1"
          fontWeight="bold"
          fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
        >
          Vote On Proposal
        </Heading>
      </Box>
      <Box margin={4} marginTop={8}>
        <Text marginBottom={2} fontSize={24} fontWeight="bold">
          PROPOSAL NAME
        </Text>
        <Text marginBottom={8} fontSize={18}>
          {proposalQuery.data?.title}
        </Text>
        <Text marginBottom={2} fontSize={24} fontWeight="bold">
          DESCRIPTION
        </Text>
        <Text marginBottom={8} fontSize={18}>
          {proposalQuery.data?.description}
        </Text>
        <Text marginBottom={2} fontSize={24} fontWeight="bold">
          DAO PROPOSAL CREATOR
        </Text>
        <Flex marginBottom={8}>
          <Text fontSize={18}>{daoIdentityQuery.data?.identity?.name}</Text>
          <Text marginLeft={8} fontSize={18}>
            {`(${daoIdentityQuery.data?.identity?.owner})`}
          </Text>
        </Flex>
        <Text marginBottom={2} fontSize={24} fontWeight="bold">
          PROPOSAL TYPE
        </Text>
        <Flex marginBottom={8}>
          <Text fontSize={18}>{prop_type + ` :`}</Text>
          <Text marginLeft={8} fontSize={18}>
            {prop_type_info}
          </Text>
        </Flex>
        <Text marginBottom={2} fontSize={24} fontWeight="bold">
          PROPOSAL STATUS
        </Text>
        <Flex marginBottom={8}>
          <Text fontSize={18}>{prop_status}</Text>
        </Flex>
        <Text marginTop={8} fontSize={24} fontWeight="bold">
          RESULTS
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(1, 1fr)">
          <Text marginBottom={8} fontSize={18}>
            YES: {proposalQuery.data?.coins_yes}
          </Text>
          <Text marginBottom={8} fontSize={18}>
            NO: {proposalQuery.data?.coins_no}
          </Text>
        </Grid>
        <Text marginBottom={2} fontSize={24} fontWeight="bold">
          DATES
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(1, 1fr)">
          <Text marginBottom={8} fontSize={18}>
            START: {proposalQuery.data ? votingStarts : ""}
          </Text>
          <Text marginBottom={8} fontSize={18}>
            END: {proposalQuery.data ? votingEnds : ""}
          </Text>
        </Grid>
        <Grid templateColumns="repeat(4, 1fr)" templateRows="repeat(1, 1fr)">
          <Flex justifyContent="center" margin={8}>
            <Button
              disabled={
                proposalQuery.data?.yes_voters.filter(
                  (voter) => voter === address
                )?.length
                  ? true
                  : false
              }
              width={150}
              height={50}
              variant="outline"
              color="white"
              bgColor="green"
              onClick={() => {
                vote = "yes";
                voteMutation.mutate();
              }}
            >
              YES
            </Button>
          </Flex>
          <Flex justifyContent="center" margin={8}>
            <Button
              disabled={
                proposalQuery.data?.no_voters.filter(
                  (voter) => voter === address
                )?.length
                  ? true
                  : false
              }
              width={150}
              height={50}
              variant="outline"
              color="white"
              bgColor="red"
              onClick={() => {
                vote = "no";
                voteMutation.mutate();
              }}
            >
              NO
            </Button>
          </Flex>
          <Flex justifyContent="center" margin={8}>
            <Button
              disabled={
                proposalQuery.data?.status === "success_concluded" ||
                proposalQuery.data?.status === "expired_concluded"
                  ? true
                  : false
              }
              width={150}
              height={50}
              variant="outline"
              color="white"
              bgColor={"primary.500"}
              onClick={() => {
                proposalConcludeMutation.mutate();
              }}
            >
              CONCLUDE
            </Button>
          </Flex>
          {proposalQuery.data?.prop_type.toString().includes("funding") ? (
            <Flex justifyContent="center" margin={8}>
              <Button
                width={150}
                height={50}
                variant="outline"
                color="white"
                bgColor="grey"
                onClick={() => {
                  proposalConcludeMutation.mutate();
                }}
              >
                CLAIM
              </Button>
            </Flex>
          ) : (
            ""
          )}
        </Grid>
      </Box>
    </Container>
  );
}
