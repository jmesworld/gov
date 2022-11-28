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
  Link,
} from "@chakra-ui/react";
import { ProposalList } from "../components/react/proposal-list";
import { useState } from "react";
import { useWallet } from "@cosmos-kit/react";
import { LCDClient } from "@terra-money/terra.js/dist/client/lcd/LCDClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Extension, MsgExecuteContract } from "@terra-money/terra.js";
import { useRouter } from "next/router";
import { ProposalRecipientForm } from "../components/react/proposal-recipient-form";
import { DaoMultisigQueryClient } from "../client/DaoMultisig.client";
import { useDaoMultisigListProposalsQuery } from "../client/DaoMultisig.react-query";
import { BankMsg, Coin, ExecuteMsg } from "../client/DaoMultisig.types";
import { FundingProposal } from "../components/react/funding-proposal";
import { ProposalDaoAddMembers } from "../components/react/proposal-dao-add-members";
import { UpdateMemberProposal } from "../components/react/update-member-proposal";
import { CoreSlotProposal } from "../components/react/core-slot-proposal";
import { RevokeCoreSlotProposal } from "../components/react/revoke-core-slot-proposal";
import { ImprovementProposal } from "../components/react/improvement-proposal";
import { TextProposal } from "../components/react/text-proposal";
import * as Governance from "../client/Governance.types";
import { useIdentityserviceGetIdentityByNameQuery } from "../client/Identityservice.react-query";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export default function Proposals() {
  const router = useRouter();
  const daoName = router.query.name;
  const daoAddress = router.query.address;

  const [recipients, setRecipients] = useState(new Array());
  const [isRecipientsNamesValid, setRecipientsNamesValid] = useState(false);
  const [isModalOpen, setModalState] = useState(false);
  const [isSelectProposalType, setSelectProposalType] = useState(true);
  const [isFundingProposalType, setFundingProposalType] = useState(false);
  const [isUpdateMemberProposalType, setUpdateMemberProposalType] =
    useState(false);
  const [isCoreSlotProposalType, setCoreSlotProposalType] = useState(false);
  const [isRevokeCoreSlotProposalType, setRevokeCoreSlotProposalType] =
    useState(false);
  const [isImprovementProposalType, setImprovementProposalType] =
    useState(false);
  const [isTextProposalType, setTextProposalType] = useState(false);

  const [proposalName, setProposalName] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");
  const [fundGovProposalType, setFundGovProposalType] = useState("dao");
  const [fundGovProposalAmount, setFundGovProposalAmount] = useState(0);

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

  const daoNameUpdateMembersQuery = useIdentityserviceGetIdentityByNameQuery({
    client,
    args: { name: daoName as string },
  });

  const daoMembersQueryClient = new DaoMultisigQueryClient(
    lcdClient,
    daoNameUpdateMembersQuery.data?.identity?.owner as string
  );

  async function createProposal() {
    const contractAddress = daoAddress as string;
    let daoMsgs: any = [];
    let govMsg: any;

    for (let recipient of recipients) {
      const coin: Coin = {
        denom: "uluna",
        amount: recipient.amount.toString(),
      };
      const bankMsg: BankMsg = {
        send: { amount: [coin], to_address: recipient.address },
      };
      daoMsgs.push({
        bank: bankMsg,
      });
    }

    if (fundGovProposalType === "gov") {
      const proposalMsg: Governance.ExecuteMsg = {
        propose: {
          funding: {
            title: proposalName.trim(),
            description: proposalDesc.trim(),
            duration: 300,
            amount: fundGovProposalAmount.toString(),
          },
        },
      };

      const deposit: Governance.Coin = { denom: "uluna", amount: "1000" };

      const wasmMsg: Governance.WasmMsg = {
        execute: {
          contract_addr: NEXT_PUBLIC_GOVERNANCE_CONTRACT,
          funds: [deposit],
          msg: toBase64(proposalMsg),
        },
      };
      const _msg: ExecuteMsg = {
        propose: {
          title: proposalName.trim(),
          description: proposalDesc.trim(),
          msgs: [
            {
              wasm: wasmMsg,
            },
          ],
        },
      };
      govMsg = _msg;
    }

    let msg: any =
      fundGovProposalType === "gov"
        ? govMsg
        : {
            propose: {
              title: proposalName.trim(),
              description: proposalDesc.trim(),
              msgs: daoMsgs,
            },
          };

    const dao_multisig_contract_addr =
      daoMembersQueryClient.contractAddress as string;

    const execMsg = new MsgExecuteContract(
      address as string,
      dao_multisig_contract_addr,
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
      proposalsQuery.refetch();
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  const proposalMutation = useMutation(["proposalMutation"], createProposal);

  const daoQueryClient = new DaoMultisigQueryClient(
    lcdClient,
    daoAddress as string
  );
  const proposalsQuery = useDaoMultisigListProposalsQuery({
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalState(false);
          setRecipients(new Array());
          setProposalName("");
          setProposalDesc("");
          setRecipientsNamesValid(false);
        }}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent maxW="50%">
          <ModalHeader fontSize={32} fontWeight="bold">
            {isSelectProposalType ? (
              <Text>Select Proposal Type</Text>
            ) : (
              "Create a Proposal"
            )}
          </ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setModalState(false);
              setSelectProposalType(true);
              setFundingProposalType(false);
              setUpdateMemberProposalType(false);
            }}
          />
          <ModalBody>
            {isSelectProposalType ? (
              <>
                <Button
                  marginRight={4}
                  marginBottom={8}
                  onClick={() => {
                    setFundingProposalType(true);
                    setSelectProposalType(false);
                  }}
                >
                  {" "}
                  Funding{" "}
                </Button>
                <Button
                  marginRight={4}
                  marginBottom={8}
                  onClick={() => {
                    setUpdateMemberProposalType(true);
                    setSelectProposalType(false);
                  }}
                >
                  {" "}
                  Update Member{" "}
                </Button>
                <Button
                  marginRight={4}
                  marginBottom={8}
                  onClick={() => {
                    setCoreSlotProposalType(true);
                    setSelectProposalType(false);
                  }}
                >
                  {" "}
                  Core Slot{" "}
                </Button>
                <Button
                  marginRight={4}
                  marginBottom={8}
                  onClick={() => {
                    setRevokeCoreSlotProposalType(true);
                    setSelectProposalType(false);
                  }}
                >
                  {" "}
                  Revoke Core Slot{" "}
                </Button>
                <Button
                  marginRight={4}
                  marginBottom={8}
                  onClick={() => {
                    setImprovementProposalType(true);
                    setSelectProposalType(false);
                  }}
                >
                  {" "}
                  Improvement{" "}
                </Button>
                <Button
                  marginRight={4}
                  marginBottom={8}
                  onClick={() => {
                    setTextProposalType(true);
                    setSelectProposalType(false);
                  }}
                >
                  {" "}
                  Text{" "}
                </Button>
              </>
            ) : isFundingProposalType ? (
              <FundingProposal
                recipients={recipients}
                setProposalName={setProposalName}
                setProposalDesc={setProposalDesc}
                setRecipients={setRecipients}
                setRecipientsNamesValid={setRecipientsNamesValid}
                proposalDesc={proposalDesc}
                proposalName={proposalName}
                proposalMutation={proposalMutation}
                isRecipientsNamesValid={isRecipientsNamesValid}
                fundGovProposalType={fundGovProposalType}
                setFundGovProposalType={setFundGovProposalType}
                fundGovProposalAmount={fundGovProposalAmount}
                setFundGovProposalAmount={setFundGovProposalAmount}
              />
            ) : isUpdateMemberProposalType ? (
              <UpdateMemberProposal daoName={daoName as string} />
            ) : isCoreSlotProposalType ? (
              <CoreSlotProposal daoName={daoName as string} />
            ) : isRevokeCoreSlotProposalType ? (
              <RevokeCoreSlotProposal daoName={daoName as string} />
            ) : isImprovementProposalType ? (
              <ImprovementProposal daoName={daoName as string} />
            ) : isTextProposalType ? (
              <TextProposal daoName={daoName as string} />
            ) : (
              ""
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Flex marginTop={24} justifyContent="center">
        {proposalsQuery.data ? (
          <ProposalList
            proposals={proposalsQuery?.data?.proposals}
            daoAddress={daoAddress as string}
          />
        ) : (
          <Spinner color="red.500" />
        )}
      </Flex>
    </Container>
  );
}

function toBase64(obj: any) {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}
