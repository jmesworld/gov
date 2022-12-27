import Head from "next/head";
import {
  Box,
  Heading,
  Text,
  Container,
  Link,
  Button,
  Flex,
  useColorMode,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  useToast,
  Grid,
  GridItem,
  background,
} from "@chakra-ui/react";
import { WalletSection } from "../components";
import { useState } from "react";
import { LCDClient } from "@terra-money/terra.js/dist/client/lcd/LCDClient";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import {
  useIdentityserviceGetIdentityByNameQuery,
  useIdentityserviceGetIdentityByOwnerQuery,
} from "../client/Identityservice.react-query";
import { useWallet } from "@cosmos-kit/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MsgExecuteContract, Extension } from "@terra-money/terra.js";
import { ExecuteMsg } from "../client/Identityservice.types";
import NextLink from "next/link";
import Governance from "./Governance";
import { GovernanceQueryClient } from "../client/Governance.client";
import {
  useGovernanceProposalQuery,
  useGovernanceProposalsQuery,
} from "../client/Governance.react-query";
import { CheckIcon } from "@chakra-ui/icons";
import * as BjmesToken from "../client/BjmesToken.types";
import {
  bjmesTokenQueryKeys,
  useBjmesTokenBalanceQuery,
} from "../client/BjmesToken.react-query";
import { BjmesTokenQueryClient } from "../client/BjmesToken.client";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;
const NEXT_PUBLIC_BJMES_TOKEN_CONTRACT = process.env
  .NEXT_PUBLIC_BJMES_TOKEN_CONTRACT as string;

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isModalOpen, setModalState] = useState(false);
  const [identityName, setIdentityName] = useState("");
  const [isIdentityNameAvailable, setIsIdentityNameAvailable] = useState(false);

  const handleIdentityNameChange = (event: any) => {
    setIdentityName(event.target.value.trim());
    setIsIdentityNameAvailable(false);
  };

  const toast = useToast();

  const walletManager = useWallet();
  const { walletStatus, address } = walletManager;

  const LCDOptions = {
    URL: LCD_URL,
    chainID: CHAIN_ID,
  };

  const lcdClient = new LCDClient(LCDOptions);
  const args = { owner: address ? address : "" };
  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    lcdClient,
    IDENTITY_SERVICE_CONTRACT
  );
  const bjmesTokenClient: BjmesTokenQueryClient = new BjmesTokenQueryClient(
    lcdClient,
    NEXT_PUBLIC_BJMES_TOKEN_CONTRACT
  );

  const { data, error } = useIdentityserviceGetIdentityByOwnerQuery({
    client,
    args,
  });

  const identityNameQuery = useIdentityserviceGetIdentityByNameQuery({
    client,
    args: { name: identityName },
    options: {
      onSuccess: (data) => {
        if (!!!data?.identity?.name.toString()) {
          setIsIdentityNameAvailable(true);
        }
      },
    },
  });

  const identityMutation = useMutation(["identityMutation"], registerUser);

  async function registerUser() {
    const ext = new Extension();
    const contract = IDENTITY_SERVICE_CONTRACT;

    const msg: ExecuteMsg = { register_user: { name: identityName } };
    const execMsg = new MsgExecuteContract(address as string, contract, msg);

    try {
      const txMsg = {
        msgs: [execMsg.toJSON(false)],
      };
      const result = await ext.request(
        "post",
        JSON.parse(JSON.stringify(txMsg))
      );
      const payload = JSON.parse(JSON.stringify(result.payload));
      if (payload.success) {
        setIdentityName("");
        setModalState(false);
        setIsIdentityNameAvailable(false);
        toast({
          title: "Identity created.",
          description: "We've created your identity for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Identity creation error.",
          description: payload.error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      // window.location.reload();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  const votingTokenMutation = useMutation(
    ["votingTokenMutation"],
    getVotingToken
  );

  async function getVotingToken() {
    const ext = new Extension();
    const contract = NEXT_PUBLIC_BJMES_TOKEN_CONTRACT;

    const msg: BjmesToken.ExecuteMsg = {
      mint: { amount: "10000", recipient: address as string },
    };
    const execMsg = new MsgExecuteContract(address as string, contract, msg);

    try {
      const txMsg = {
        msgs: [execMsg.toJSON(false)],
      };
      const result = await ext.request(
        "post",
        JSON.parse(JSON.stringify(txMsg))
      );
      const payload = JSON.parse(JSON.stringify(result.payload));
      if (payload.success) {
        toast({
          title: "Tokens minted.",
          description: "We've minted your tokens for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Token minting error.",
          description: payload.error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  const votingTokenQuery = useBjmesTokenBalanceQuery({
    client: bjmesTokenClient,
    args: { address: address as string },
    options: { refetchInterval: 10 },
  });

  return (
    <Container maxW="7xl" py={10}>
      <Head>
        <title>JMES Governance App</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex justifyContent="end" mb={4} alignItems="center">
        <WalletSection />
        {typeof address !== "undefined" ? (
          data?.identity ? (
            <Text marginLeft={8}> Hi, {data.identity.name}</Text>
          ) : (
            <Button
              marginLeft={8}
              justifyContent="center"
              alignItems="center"
              borderRadius="lg"
              width={200}
              height={50}
              color="primary.500"
              variant="outline"
              px={0}
              onClick={() => setModalState(true)}
            >
              Create Identity
            </Button>
          )
        ) : (
          ""
        )}
      </Flex>
      {data?.identity ? (
        <Flex justifyContent="end" mb={4} alignItems="center" marginTop={8}>
          <Text
            marginLeft={8}
          >{`Balance: ${votingTokenQuery?.data?.balance.toString()} Bjmes`}</Text>

          <Button
            marginLeft={8}
            justifyContent="center"
            alignItems="center"
            borderRadius="lg"
            width={200}
            height={50}
            color="primary.500"
            variant="outline"
            px={0}
            onClick={() => votingTokenMutation.mutate()}
          >
            Get Voting Token
          </Button>
        </Flex>
      ) : (
        ""
      )}

      <Box textAlign="center" marginBottom={24} marginTop={24}>
        <Heading
          as="h1"
          fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
          fontWeight="extrabold"
          mb={3}
        >
          JMES Governance App
        </Heading>
        <Heading
          as="h1"
          fontWeight="bold"
          fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
        >
          <Text
            as="span"
            color={useColorModeValue("primary.500", "primary.200")}
          >
            Liberate ART together
          </Text>
        </Heading>
      </Box>
      {!!address ? (
        <NextLink href={{ pathname: "/DAOs" }} passHref={true}>
          <Link fontWeight="bold" fontSize={24}>
            My DAOs
          </Link>
        </NextLink>
      ) : (
        ""
      )}
      <Governance />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalState(false)}
        scrollBehavior={"inside"}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader fontSize={32} fontWeight="bold">
              Create Identity
            </ModalHeader>
            <ModalCloseButton
              onClick={() => {
                setModalState(false);
                setIdentityName("");
                setIsIdentityNameAvailable(false);
              }}
            />
            <ModalBody>
              <Box>
                <Text marginBottom={2} fontSize={24}>
                  USERNAME
                </Text>
                <Grid
                  templateColumns="repeat(10, 1fr)"
                  templateRows="repeat(1, 1fr)"
                >
                  <GridItem colSpan={9}>
                    <Input
                      value={identityName}
                      onChange={handleIdentityNameChange}
                      placeholder="Enter Identity"
                      size="lg"
                      marginBottom={2}
                      onBlur={() => {
                        identityNameQuery.refetch();
                      }}
                    ></Input>
                  </GridItem>
                  <GridItem colSpan={1} marginLeft={4} marginTop={2}>
                    {isIdentityNameAvailable && identityName.length > 0 ? (
                      <CheckIcon color="green" />
                    ) : (
                      ""
                    )}
                  </GridItem>
                </Grid>
                <Text marginBottom={8} fontSize={16}>
                  {identityName.length > 0
                    ? identityNameQuery.isFetched
                      ? identityNameQuery?.data?.identity?.name.toString() ===
                        identityName
                        ? "Name taken!"
                        : ""
                      : "Checking..."
                    : ""}
                </Text>
                <Flex justifyContent="center" margin={8}>
                  <Button
                    onClick={() => {
                      identityMutation.mutate();
                    }}
                    disabled={
                      !(
                        identityNameQuery?.data?.identity?.name.toString() ===
                        identityName
                      ) &&
                      identityName.length > 1 &&
                      !!identityNameQuery.isFetched
                        ? false
                        : true
                    }
                    width={200}
                    height={50}
                    variant="outline"
                    color="white"
                    bgColor={useColorModeValue("primary.500", "primary.200")}
                    _hover={{ bg: "primary.500" }}
                  >
                    {" "}
                    Create Identity{" "}
                  </Button>
                </Flex>
              </Box>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}
