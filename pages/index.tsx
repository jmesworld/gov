import Head from "next/head";
import {
  Box,
  Divider,
  Grid,
  Heading,
  Text,
  Stack,
  Container,
  Link,
  Button,
  Flex,
  Icon,
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
} from "@chakra-ui/react";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { Product, Dependency, WalletSection } from "../components";
import { dependencies, products } from "../config";
import { useState } from "react";
import { LCDClient } from "@terra-money/terra.js/dist/client/lcd/LCDClient";
import {
  IdentityserviceClient,
  IdentityserviceQueryClient,
} from "../client/Identityservice.client";
import {
  useIdentityserviceGetIdentityByNameQuery,
  useIdentityserviceGetIdentityByOwnerQuery,
  useIdentityserviceRegisterUserMutation,
} from "../client/Identityservice.react-query";
import { useWallet } from "@cosmos-kit/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  MsgExecuteContract,
  CreateTxOptions,
  Extension,
  Coin,
  ExtensionOptions,
} from "@terra-money/terra.js";
import { ExecuteMsg } from "../client/Identityservice.types";
import NextLink from "next/link";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isModalOpen, setModalState] = useState(false);
  const [identityName, setIdentityName] = useState("");

  const handleIdentityNameChange = (event: any) =>
    setIdentityName(event.target.value.trim());

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
  const { data, error } = useIdentityserviceGetIdentityByOwnerQuery({
    client,
    args,
  });

  const identityNameQuery = useIdentityserviceGetIdentityByNameQuery({
    client,
    args: { name: identityName },
  });

  const identityMutation = useMutation(["identityMutation"], registerUser);

  async function registerUser() {
    const ext = new Extension();
    const contract = process.env.IDENTITY_SERVICE_CONTRACT as string;

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

  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>JMES Governance App</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex justifyContent="end" mb={4}>
        {data?.identity ? (
          <Text> Hi, {data.identity.name}</Text>
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
            Create an Identity
          </Button>
        )}
      </Flex>
      <Box textAlign="center">
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
            Let&apos;s Liberate ART together
          </Text>
        </Heading>
      </Box>
      <WalletSection />
      <NextLink href={{ pathname: "/DAOs" }} passHref={true}>
        <Link fontWeight="bold" fontSize={24}>
          My DAOs
        </Link>
      </NextLink>

      <Modal isOpen={isModalOpen} onClose={() => setModalState(false)}  scrollBehavior={"inside"}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader fontSize={32} fontWeight="bold">
              Create an Identity
            </ModalHeader>
            <ModalCloseButton
              onClick={() => {
                setModalState(false);
                setIdentityName("");
              }}
            />
            <ModalBody>
              <Box>
                <Text marginBottom={2} fontSize={24}>
                  NAME
                </Text>
                <Input
                  value={identityName}
                  onChange={handleIdentityNameChange}
                  placeholder="Type your name here"
                  size="lg"
                  marginBottom={2}
                ></Input>
                <Text marginBottom={8} fontSize={16}>
                  {identityName.length > 0
                    ? identityNameQuery.isFetched
                      ? identityNameQuery?.data?.identity?.name.toString() ===
                        identityName
                        ? "Name taken!"
                        : "available"
                      : ""
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
                      ) && identityName.length > 1
                        ? false
                        : true
                    }
                    width={200}
                    height={50}
                    variant="outline"
                    color="white"
                    bgColor={useColorModeValue("primary.500", "primary.200")}
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
