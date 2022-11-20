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
import { DaoQueryClient } from "../client/Dao.client";
import {
  useDaoListVotesQuery,
  useDaoProposalQuery,
} from "../client/Dao.react-query";
import { LCDClient } from "@terra-money/terra.js/dist/client/lcd/LCDClient";
import { useMutation } from "@tanstack/react-query";
import { Extension, MsgExecuteContract } from "@terra-money/terra.js";
import { useRouter } from "next/router";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

export default function ProposalDetail() {
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

  const daoQueryClient = new DaoQueryClient(lcdClient, daoAddress as string);
  const proposalQuery = useDaoProposalQuery({
    client: daoQueryClient,
    args: { proposalId: proposalId ? parseInt(proposalId as string) : 0 },
  });

  const votesQuery = useDaoListVotesQuery({
    client: daoQueryClient,
    args: { proposalId: proposalId ? parseInt(proposalId as string) : 0 },
  });

  async function voteOnProposal() {
    const msg = {
      vote: {
        proposal_id: parseInt(proposalId as string),
        vote: vote,
      },
    };
    const execMsg = new MsgExecuteContract(
      address as string,
      daoAddress as string,
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

  async function executeProposal() {
    const msg = {
      execute: {
        proposal_id: parseInt(proposalId as string),
      },
    };
    const execMsg = new MsgExecuteContract(
      address as string,
      daoAddress as string,
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

  const proposalExecuteMutation = useMutation(
    ["proposalExecuteMutation"],
    executeProposal
  );

  // async function getRecipients() {
  //   const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
  //     lcdClient,
  //     "terra19wzedfegwqjpxp3zjgc4x426u8ylkyuzeeh3hrhzueljsz5wzdzsc2xef8"
  //   );
  //   try {
  //   let recipients: any[] = [];
  //   if (proposalQuery.data) {
  //     const _msgs: any[]  = proposalQuery.data ? proposalQuery.data?.msgs : [];
  //     for (let _msg of _msgs) {
  //       const _addrs = _msg['bank']['send']['to_address'];
  //       const _amount = _msg['bank']['send']['amount'];
  //       const _nameResponse = await client.getIdentityByOwner({ owner: _addrs });
  //       recipients.push({
  //         name: _nameResponse.identity ? _nameResponse.identity.name : "",
  //         amount: _amount
  //       });
  //     }
  //   }
  //   return recipients;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // const recipientsQuery = useQuery(['recipientsQuery'], getRecipients);

  const proposalThreshold: any = proposalQuery.data?.threshold;
  const proposalThresholdWeight = proposalQuery.data
    ? proposalThreshold["absolute_count"]["weight"]
    : 0;

  const proposalExpiryDate: any = proposalQuery.data?.expires;

  const proposalMsgs: any[] = proposalQuery.data
    ? proposalQuery.data?.msgs
    : [];
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
          RECIPIENTS
        </Text>
        {proposalMsgs.map((recipient, i) => (
          <Text key={i} marginBottom={2} fontSize={18}>
            {recipient["bank"]["send"]["to_address"]}{" "}
            {recipient["bank"]["send"]["amount"][0]["amount"]}{" "}
            {recipient["bank"]["send"]["amount"][0]["denom"]}
          </Text>
        ))}
        <Text marginTop={8} fontSize={24} fontWeight="bold">
          RESULTS
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(1, 1fr)">
          <Text marginBottom={8} fontSize={18}>
            YES:{" "}
            {
              votesQuery.data?.votes.filter(
                (vote) =>
                  vote.proposal_id === parseInt(proposalId as string) &&
                  vote.vote === "yes"
              )?.length
            }
          </Text>
          <Text marginBottom={8} fontSize={18}>
            NO:{" "}
            {
              votesQuery.data?.votes.filter(
                (vote) =>
                  vote.proposal_id === parseInt(proposalId as string) &&
                  vote.vote === "no"
              )?.length
            }
          </Text>
        </Grid>
        <Text marginBottom={2} fontSize={24} fontWeight="bold">
          DATES
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(1, 1fr)">
          {/* <Text marginBottom={8} fontSize={18}>
            START:
          </Text> */}
          <Text marginBottom={8} fontSize={18}>
            END:{" "}
            {proposalQuery.data
              ? proposalExpiryDate["at_height"] + " (block height)"
              : ""}
          </Text>
        </Grid>
        <Grid templateColumns="repeat(3, 1fr)" templateRows="repeat(1, 1fr)">
          <Flex justifyContent="center" margin={8}>
            <Button
              disabled={
                votesQuery.data?.votes.filter((vote) => vote.voter === address)
                  ?.length
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
                votesQuery.data?.votes.filter((vote) => vote.voter === address)
                  ?.length
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
                (votesQuery.data?.votes.filter((vote) => vote.vote === "yes")
                  ?.length as number) < proposalThresholdWeight &&
                proposalQuery.data?.status === "executed"
                  ? true
                  : false
              }
              width={150}
              height={50}
              variant="outline"
              color="white"
              bgColor={useColorModeValue("primary.500", "primary.200")}
              onClick={() => {
                proposalExecuteMutation.mutate();
              }}
            >
              EXECUTE
            </Button>
          </Flex>
        </Grid>
      </Box>
    </Container>
  );
}
