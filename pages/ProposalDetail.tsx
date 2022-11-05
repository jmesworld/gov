import Head from "next/head";
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  Grid,
  GridItem,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Input,
  Icon,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import { ProposalList } from "../components/react/proposal-list";
import { useState } from "react";
import { useWallet } from "@cosmos-kit/react";
import {
  IdentityserviceClient,
  IdentityserviceQueryClient,
} from "../client/Identityservice.client";
import {
  useIdentityserviceDaosQuery,
  useIdentityserviceGetIdentityByNameQuery,
  useIdentityserviceGetIdentityByOwnerQuery,
} from "../client/Identityservice.react-query";
import { DaoClient, DaoQueryClient } from "../client/Dao.client";
import {
  useDaoListProposalsQuery,
  useDaoListVotesQuery,
  useDaoNameQuery,
  useDaoProposalQuery,
} from "../client/Dao.react-query";
import { LCDClient } from "@terra-money/terra.js/dist/client/lcd/LCDClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Extension, MsgExecuteContract } from "@terra-money/terra.js";
import {
  DaoInstantiateMsg,
  ExecuteMsg,
  Ordering,
} from "../client/Identityservice.types";
import { useRouter } from "next/router";
import { ProposalRecipientForm } from "../components/react/proposal-recipient-form";
import * as Governance from "../client/Governance.types";
import * as BjmesToken from "../client/BjmesToken.types";
import * as Dao from "../client/Dao.types";
import exp from "constants";
import { VoteOption } from "../client/Governance.types";

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
    URL: "https://pisco-lcd.terra.dev",
    chainID: "pisco-1",
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

  async function getProposalExpiryDate() {
    try {
    const expires = proposalQuery.data?.expires;
    const date = await dateFromBlockHeight(JSON.parse(JSON.stringify(expires))['at_height']);
    return date;
    } catch (error) {
      console.log(error);
    }
  }
  const proposalExpiryDate = useQuery(['proposalExpiryDate'], getProposalExpiryDate);
  
  const proposalMsgs: any[] = proposalQuery.data ? proposalQuery.data?.msgs : [];

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
        {
          proposalMsgs.map((recipient, i) => (
          <Text key={i} marginBottom={2} fontSize={18}>
            {recipient['bank']['send']['to_address']} {recipient['bank']['send']['amount'][0]['amount']} {recipient['bank']['send']['amount'][0]['denom']}
          </Text>
          )
          )
        }
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
            END: 
            {/* {proposalExpiryDate.data ? proposalExpiryDate.data : ""}  */}
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
                  ?.length as number) < proposalThresholdWeight
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

export const RecipientList = ({}) => {};

export const dateFromBlockHeight = async (blockHeight: number) => {
  const LCDOptions = {
    URL: "https://pisco-lcd.terra.dev",
    chainID: "pisco-1",
  };

  const lcdClient = new LCDClient(LCDOptions);

  const currentBlockInfo = await lcdClient.tendermint.blockInfo();
  const currentBlockHeight = currentBlockInfo.block.header.height;
  const currentBlockTimestamp = currentBlockInfo.block.header.time;
  const currentBlockDate = new Date(currentBlockTimestamp);
  const currentBlockEpoch = currentBlockDate.getTime();

  const prevBlockInfo = await lcdClient.tendermint.blockInfo(
    parseInt(currentBlockHeight) - 10
  );
  const prevBlockHeight = prevBlockInfo.block.header.height;
  const prevBlockTimestamp = prevBlockInfo.block.header.time;
  const prevBlockDate = new Date(prevBlockTimestamp);
  const prevBlockEpoch = prevBlockDate.getTime();

  const d1 = currentBlockEpoch - prevBlockEpoch;
  const d2 = blockHeight - parseInt(prevBlockHeight);
  const d3 = parseInt(currentBlockHeight) - parseInt(prevBlockHeight);
  const d4 = d1 * (d2 / d3);
  const epoch = Math.ceil(d4 + prevBlockEpoch);
  const targetDate = new Date(epoch);

  return targetDate.toString();
};
