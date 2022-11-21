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
  Text,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { DAOList } from "../components/react/dao-list";
import { useState } from "react";
import { DAOCosignerForm } from "../components/react/dao-cosigner-form";
import { useWallet } from "@cosmos-kit/react";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import {
  useIdentityserviceDaosQuery,
  useIdentityserviceGetIdentityByNameQuery,
  useIdentityserviceGetIdentityByOwnerQuery,
} from "../client/Identityservice.react-query";
import { DaoQueryClient } from "../client/Dao.client";
import { LCDClient } from "@terra-money/terra.js/dist/client/lcd/LCDClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Extension, MsgExecuteContract } from "@terra-money/terra.js";
import {
  DaoInstantiateMsg,
  ExecuteMsg,
  Ordering,
} from "../client/Identityservice.types";
import { Voter } from "../client/Dao.types";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

export default function MyDAOs() {
  const [isModalOpen, setModalState] = useState(false);
  const [cosigners, setCosigners] = useState(new Array());
  const [cosignersTotalWeight, setCosignersTotalWeight] = useState(
    new Array<number>()
  );
  const [threshold, setThreshold] = useState(0);
  const [thresholdPercentage, setThresholdPercentage] = useState(0);
  const [daoName, setDaoName] = useState("");
  const [isDaoNameValid, setDaoNameValidity] = useState(false);
  const [isIdNamesValid, setIdNamesValid] = useState(false);
  const [isNewDataUpdated, setDataUpdated] = useState(false);

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
  const order: Ordering = "ascending";
  const args = { order: order, limit: 100000 };
  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    lcdClient,
    IDENTITY_SERVICE_CONTRACT
  );
  const { data, error } = useIdentityserviceDaosQuery({ client, args });
  const ownerQueryResult = useIdentityserviceGetIdentityByOwnerQuery({
    client,
    args: { owner: address as string },
  });

  const daoNameQuery = useIdentityserviceGetIdentityByNameQuery({
    client,
    args: { name: daoName },
  });

  async function useMyDaos() {
    let myDaos: any = "undefined";
    if (data) {
      myDaos = [];
      for (const i in data?.daos) {
        const daoAddrs = data?.daos[i][1];
        const daoQueryClient = new DaoQueryClient(lcdClient, daoAddrs);
        const voter: any = await daoQueryClient.voter({
          address: address ? address : "",
        });
        if (voter.weight > 0) {
          const nameResult = await daoQueryClient.name();
          myDaos.push({
            name: nameResult.name,
            address: daoAddrs,
          });
        }
      }
    }
    return myDaos;
  }

  const myDaos = useQuery(["myDaos"], useMyDaos, {
    onSuccess: (data) => {
      if (data !== "undefined") {
        let storeData = new Map<string, any>();
        storeData.set(address as string, data);
        localStorage.setItem(
          "myDaosData",
          JSON.stringify(Object.fromEntries(storeData))
        );
      }
      setDataUpdated(true);
    },
    refetchInterval: 1000,
  });
  async function registerDao() {
    let _voters: Voter[] = [];
    try {
      const minimum = Math.min(...cosignersTotalWeight);
      const minimumIndex = cosignersTotalWeight.indexOf(minimum);
      cosigners[minimumIndex].weight = 1;

      for (let i = 0; i < cosignersTotalWeight.length; i++) {
        if (i !== minimumIndex) {
          const ratio = Math.ceil(
            cosignersTotalWeight[i] / cosignersTotalWeight[minimumIndex]
          );
          cosigners[i].weight = ratio;
        }
      }

      setCosigners(cosigners);

      for (let c of cosigners) {
        const _addrResponse = await client.getIdentityByName({ name: c.name });
        _voters.push({
          addr: _addrResponse.identity ? _addrResponse.identity?.owner : "",
          weight: c.weight,
        });
      }
      const _threshold = {
        absolute_count: {
          weight: threshold,
        },
      };

      const _maxVotingPeriod = {
        height: 1180000,
      };

      const daoData: DaoInstantiateMsg = {
        dao_name: daoName,
        max_voting_period: _maxVotingPeriod,
        threshold: _threshold,
        voters: _voters,
      };

      const ext = new Extension();
      const contract = IDENTITY_SERVICE_CONTRACT;

      const msg: ExecuteMsg = { register_dao: daoData };
      const execMsg = new MsgExecuteContract(address as string, contract, msg);
      const txMsg = {
        msgs: [execMsg.toJSON(false)],
      };
      const result = await ext.request(
        "post",
        JSON.parse(JSON.stringify(txMsg))
      );
      const payload = JSON.parse(JSON.stringify(result.payload));
      if (payload.success) {
        setCosigners(new Array());
        setDaoName("");
        setThreshold(0);
        setModalState(false);
        toast({
          title: "Dao created.",
          description:
            "We've created your Dao for you. You'll be able to access it once it's been included in a block.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Dao creation error.",
          description: payload.error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      myDaos.refetch();
    } catch (error) {
      console.log(error);
    }
  }

  const daoMutation = useMutation(["daoMutation"], registerDao);

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
              My DAOs
            </Heading>
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
              Create DAO
            </Button>
          </Flex>
        </GridItem>
      </Grid>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalState(false);
          setDaoName("");
        }}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent maxW="50%">
          <ModalHeader fontSize={32} fontWeight="bold">
            Create a DAO
          </ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setCosigners(new Array());
              setDaoName("");
              setThreshold(0);
              setModalState(false);
            }}
          />
          <ModalBody>
            <Box>
              <Text marginBottom={2} fontSize={24}>
                DAO NAME
              </Text>
              <Input
                marginBottom={2}
                placeholder="Type your DAO name here"
                size="lg"
                onChange={(event) => {
                  setDaoName(event.target.value.trim());
                }}
              ></Input>
              <Text marginBottom={2} fontSize={16}>
                {daoName.length > 0
                  ? daoNameQuery.isFetched
                    ? daoNameQuery?.data?.identity?.name.toString() === daoName
                      ? "Name taken!"
                      : "Available"
                    : "Checking..."
                  : ""}
              </Text>
              <Grid
                templateColumns="repeat(2, 1fr)"
                templateRows="repeat(1, 1fr)"
                marginTop={8}
              >
                <Text fontSize={24}>COSIGNERS</Text>
                <Button
                  variant="outline"
                  width={100}
                  onClick={() => {
                    setCosigners((cosigners) => [
                      ...cosigners,
                      { name: "", weight: 0, id: cosigners.length + 1 },
                    ]);
                  }}
                >
                  <Text fontSize={18} fontWeight="bold">
                    +
                  </Text>
                </Button>
                <DAOCosignerForm
                  cosigners={cosigners}
                  setCosigners={setCosigners}
                  owner={{
                    name: ownerQueryResult.data?.identity?.name as string,
                    address: address ? address : "",
                  }}
                  cosignersTotalWeight={cosignersTotalWeight}
                  setCosignersTotalWeight={setCosignersTotalWeight}
                  setIdNamesValid={setIdNamesValid}
                />
              </Grid>
              <Grid
                templateColumns="repeat(2, 1fr)"
                templateRows="repeat(1, 1fr)"
                paddingTop={18}
              >
                <Text fontSize={24}>% TO PASS</Text>
                <Flex justifyContent="end">
                  <Input
                    size="md"
                    width={250}
                    placeholder="% to pass"
                    type="number"
                    onBlur={() => {
                      daoNameQuery.refetch();
                    }}
                    onChange={(event) => {
                      setThresholdPercentage(
                        parseInt(event.target.value.trim())
                      );
                      setThreshold(
                        Math.ceil(
                          (parseInt(event.target.value.trim()) / 100) *
                            cosigners.length
                        )
                      );
                    }}
                  />
                </Flex>
              </Grid>
              <Flex justifyContent="center" margin={8}>
                <Button
                  disabled={
                    !(
                      daoNameQuery?.data?.identity?.name.toString() === daoName
                    ) &&
                    isIdNamesValid &&
                    daoName.length > 1 &&
                    thresholdPercentage >= 30 &&
                    thresholdPercentage <= 100 &&
                    sumArray(cosignersTotalWeight) === 100
                      ? false
                      : true
                  }
                  width={200}
                  height={50}
                  variant="outline"
                  color="white"
                  bgColor={useColorModeValue("primary.500", "primary.200")}
                  onClick={() => daoMutation.mutate()}
                >
                  {" "}
                  Create DAO{" "}
                </Button>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Flex marginTop={24} justifyContent="center">
        {typeof window !== "undefined" &&
        address !== "undefined" &&
        !(localStorage.getItem("myDaosData") as string)?.includes(
          "undefined"
        ) ? (
          <DAOList daos={localStorage.getItem("myDaosData") as string} />
        ) : (
          <Spinner color="red.500" />
        )}
      </Flex>
    </Container>
  );
}

function sumArray(arr: number[]): number {
  const result = arr.reduce((accumulator, current) => {
    return accumulator + current;
  }, 0);
  return result;
}
