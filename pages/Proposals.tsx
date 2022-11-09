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
  Spinner,
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

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

export default function Proposals() {
  const router = useRouter();
  const daoName = router.query.name;
  const daoAddress = router.query.address;

  const [recipients, setRecipients] = useState(new Array());
  const [isRecipientsNamesValid, setRecipientsNamesValid] = useState(false);
  const [isModalOpen, setModalState] = useState(false);
  const [proposalName, setProposalName] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");

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

  async function createProposal() {
    const contractAddress = daoAddress as string;
    let msgs = [];

    for (let recipient of recipients) {
      const coin: Dao.Coin = {
        denom: "uluna",
        amount: recipient.amount.toString(),
      };
      const bankMsg: Dao.BankMsg = {
        send: { amount: [coin], to_address: recipient.address },
      };
      msgs.push({
        bank: bankMsg,
      });
    }

    const msg: Dao.ExecuteMsg = {
      propose: {
        title: proposalName.trim(),
        description: proposalDesc.trim(),
        msgs: msgs,
      },
    };

    const execMsg = new MsgExecuteContract(
      address as string,
      contractAddress,
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
        setRecipients(new Array());
        setRecipientsNamesValid(false);
        setProposalDesc("");
        setProposalName("");
        setModalState(false);
        toast({
          title: "Proposal created.",
          description: "We've created your Proposal for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Proposal creation error.",
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

  const proposalMutation = useMutation(["proposalMutation"], createProposal);

  const daoQueryClient = new DaoQueryClient(lcdClient, daoAddress as string);
  const proposalsQuery = useDaoListProposalsQuery({
    client: daoQueryClient,
    args: { limit: 10000 },
  });

  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>JMES Governance App</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid templateColumns="repeat(3, 1fr)" templateRows="repeat(1, 1fr)">
        <GridItem colSpan={1} />
        <GridItem colSpan={1}>
          <Box textAlign="center">
            <Heading
              as="h1"
              fontWeight="bold"
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            >
              Proposals
            </Heading>
            <Heading as="h2">{daoName}</Heading>
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex justifyContent="end" mb={4}>
            <Button
              justifyContent="center"
              alignItems="center"
              borderRadius="lg"
              width={150}
              height={50}
              color={useColorModeValue("primary.500", "primary.200")}
              variant="outline"
              px={0}
              onClick={() => setModalState(true)}
            >
              Create Proposal
            </Button>
          </Flex>
        </GridItem>
      </Grid>
      <Modal isOpen={isModalOpen} onClose={() => setModalState(false)}  scrollBehavior={"inside"}>
        <ModalOverlay />
        <ModalContent maxW="50%">
          <ModalHeader fontSize={32} fontWeight="bold">
            Create a Proposal
          </ModalHeader>
          <ModalCloseButton onClick={() => setModalState(false)} />
          <ModalBody>
            <Box>
              <Text marginBottom={2} fontSize={24}>
                PROPOSAL NAME
              </Text>
              <Input
                marginBottom={4}
                placeholder="Type your Proposal name here"
                size="lg"
                onChange={(event) => {
                  setProposalName(event.target.value.trim());
                }}
              ></Input>
              <Text marginBottom={2} fontSize={24}>
                DESCRIPTION
              </Text>
              <Textarea
                marginBottom={2}
                placeholder="Enter your description here"
                size="lg"
                onChange={(event) => {
                  setProposalDesc(event.target.value.trim());
                }}
              ></Textarea>
              <Grid
                templateColumns="repeat(2, 1fr)"
                templateRows="repeat(1, 1fr)"
                marginTop={8}
              >
                <Text fontSize={24}>RECIPIENT</Text>
                <Flex justifyContent="end">
                  <Button
                    variant="outline"
                    width={100}
                    onClick={() => {
                      setRecipients((recipients) => [
                        ...recipients,
                        {
                          name: "",
                          amount: 0,
                          id: recipients.length + 1,
                          address: "",
                        },
                      ]);
                    }}
                  >
                    <Text fontSize={18} fontWeight="bold">
                      +
                    </Text>
                  </Button>
                </Flex>
                <ProposalRecipientForm
                  recipients={recipients}
                  setRecipients={setRecipients}
                  setRecipientsNamesValid={setRecipientsNamesValid}
                />
              </Grid>
              <Flex justifyContent="center" margin={8}>
                <Button
                  disabled={
                    isRecipientsNamesValid &&
                    proposalName.length > 2 &&
                    proposalDesc.length > 2
                      ? false
                      : true
                  }
                  width={250}
                  height={50}
                  variant="outline"
                  color="white"
                  bgColor={useColorModeValue("primary.500", "primary.200")}
                  onClick={() => proposalMutation.mutate()}
                >
                  {" "}
                  Create DAO Proposal{" "}
                </Button>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Flex marginTop={24} justifyContent='center'>
        {proposalsQuery.data ? (
          <ProposalList
          // @ts-ignore
            proposals={proposalsQuery?.data?.proposals}
            daoAddress={daoAddress as string}
          />
        ) : (
          <Spinner color='red.500' />
        )}
      </Flex>
    </Container>
  );
}

function toBase64(obj: any) {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}
