import Head from "next/head";
import { Container, Flex, Spacer, VStack, Text, Box } from "@chakra-ui/react";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import {
  useIdentityserviceDaosQuery,
  useIdentityserviceGetIdentityByOwnerQuery,
} from "../client/Identityservice.react-query";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../config/defaults";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useEffect, useState } from "react";
import { Ordering } from "../client/Identityservice.types";
import { useMyDaosList } from "../hooks/useMyDaosList";
import { DaoProposal } from "../components/DaoProposal";
import GovernanceProposal from "./GovernanceProposal";
import { WalletStatus } from "@cosmos-kit/core";
import { JMESLogo } from "../components/react";
import { NavBarItem } from "../components/react/navigation-item";
import { NavBarButton } from "../components/react/navbar-button";
import { BjmesTokenQueryClient } from "../client/BjmesToken.client";
import { useBjmesTokenBalanceQuery } from "../client/BjmesToken.react-query";

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;
const BJMES_TOKEN_CONTRACT = process.env
  .NEXT_PUBLIC_BJMES_TOKEN_CONTRACT as string;

export default function Home() {
  const { address, status, getCosmWasmClient } = useChain(chainName);

  const [isGovProposalSelected, setIsGovProposalSelected] = useState(true);
  const [selectedDao, setSelectedDao] = useState("");
  const [selectedDaoName, setSelectedDaoName] = useState("");
  const [isNewDataUpdated, setDataUpdated] = useState(false);
  const [viewDimension, setViewDimension] = useState(Array());
  const [identityBalance, setIdentityBalance] = useState("");
  const [identityName, setIdentityName] = useState("");

  useEffect(() => {
    const { innerHeight, innerWidth } = window;
    setViewDimension([innerWidth, innerHeight]);
  }, []);

  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  useEffect(() => {
    getCosmWasmClient()
      .then((cosmWasmClient) => {
        if (!cosmWasmClient) {
          return;
        }
        setCosmWasmClient(cosmWasmClient);
      })
      .catch((error) => console.log(error));
  }, [getCosmWasmClient]);

  const myDaos = useMyDaosList(
    address as string,
    cosmWasmClient as CosmWasmClient,
    setDataUpdated
  );

  const identityserviceQueryClient: IdentityserviceQueryClient =
    new IdentityserviceQueryClient(
      cosmWasmClient as CosmWasmClient,
      IDENTITY_SERVICE_CONTRACT
    );
  const bjmesTokenQueryClient: BjmesTokenQueryClient =
    new BjmesTokenQueryClient(
      cosmWasmClient as CosmWasmClient,
      BJMES_TOKEN_CONTRACT
    );

  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceQueryClient,
    args: { owner: address ? address : "" },
    options: {
      refetchInterval: 10,
      onSuccess: (data) => {
        setIdentityName(data?.identity?.name as string);
      },
    },
  });

  const identityOwnerBalanceQuery = useBjmesTokenBalanceQuery({
    client: bjmesTokenQueryClient,
    args: { address: address as string },
    options: {
      //  refetchInterval: 10,
      onSuccess: (data) => {
        setIdentityBalance(data?.balance as string);
      },
    },
  });

  return (
    <Container
      maxW="100%"
      maxH="100%"
      padding={0}
      backgroundColor={"rgba(198, 180, 252, 0.3)"}
    >
      <Head>
        <title>JMES Governance</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex padding={0} width={viewDimension[0]} height={viewDimension[1]}>
        <VStack
          width={"200px"}
          height={"100%"}
          backgroundColor={"#7453FD"}
          paddingTop={"30px"}
          paddingLeft={"0px"}
          // overflowY="scroll"
          alignItems="start"
        >
          <JMESLogo />
          <Box height={"30px"} />
          <Flex
            width={"200px"}
            height={"42px"}
            // marginTop={"30px"}
            paddingLeft={"26px"}
            backgroundColor={"#7453FD"}
          >
            {" "}
            <Text
              color="#A1F0C4"
              fontFamily={"DM Sans"}
              fontWeight="bold"
              fontSize={12}
              alignSelf="center"
            >
              GOVERNANCE
            </Text>
          </Flex>
          <NavBarItem
            text="Proposals"
            isSelected={isGovProposalSelected}
            onClick={() => {
              setIsGovProposalSelected(true);
              setSelectedDao("");
              setSelectedDaoName("");
            }}
          />
          <Box height={"27px"} />
          <Flex
            width={"200px"}
            height={"42px"}
            paddingLeft={"26px"}
            backgroundColor={"#7453FD"}
          >
            {" "}
            <Text
              color="#A1F0C4"
              fontFamily={"DM Sans"}
              fontWeight="bold"
              fontSize={12}
              alignSelf="center"
            >
              MY DAOS
            </Text>
          </Flex>
          {typeof window !== "undefined" &&
          address !== "undefined" &&
          !(localStorage.getItem("myDaosData") as string)?.includes(
            "undefined"
          ) ? (
            <MyDaosList
              daos={localStorage.getItem("myDaosData") as string}
              selectedDao={selectedDao}
              setSelectedDao={setSelectedDao}
              setIsGovProposalSelected={setIsGovProposalSelected}
              selectedDaoName={selectedDaoName}
              setSelectedDaoName={setSelectedDaoName}
            />
          ) : (
            <></>
          )}
          <Flex height={"20px"} />
          <NavBarButton
            width="180px"
            height="48px"
            text={"New DAO"}
            disabled={false}
            onClick={() => {}}
          />
          <Spacer />
          <NavBarButton
            width="180px"
            height="48px"
            text="DAO Proposal"
            disabled={status !== WalletStatus.Connected}
            onClick={() => {}}
          />
          <NavBarButton
            width="180px"
            height="48px"
            text="GOV Proposal"
            disabled={status !== WalletStatus.Connected}
            onClick={() => {}}
          />
          <Flex height={"10px"} />
        </VStack>
        {isGovProposalSelected ? (
          <GovernanceProposal
            identityName={identityName}
            identityBalance={identityBalance}
          />
        ) : (
          <DaoProposal
            daoAddress={selectedDao}
            daoName={selectedDaoName}
            identityName={identityName}
            identityBalance={identityBalance}
          />
        )}
      </Flex>
    </Container>
  );
}

export const MyDaosList = ({
  daos,
  setIsGovProposalSelected,
  selectedDao,
  setSelectedDao,
  selectedDaoName,
  setSelectedDaoName,
}: {
  daos: any;
  setIsGovProposalSelected: Function;
  selectedDao: string;
  setSelectedDao: Function;
  selectedDaoName: string;
  setSelectedDaoName: Function;
}) => {
  const chainContext = useChain(chainName);
  const { address } = chainContext;
  const daosJSON = JSON.parse(daos);

  if (!daosJSON) {
    return <></>;
  }

  if (!daosJSON[address as string]) {
    return <></>;
  } else if (Array.from(daosJSON[address as string]).length === 0) {
    return <></>;
  } else {
    const daoItems = daosJSON[address as string].map(
      (dao: { name: any; address: any }) => (
        <NavBarItem
          key={dao.name}
          text={dao.name}
          isSelected={selectedDao === dao.address ? true : false}
          onClick={() => {
            setIsGovProposalSelected(false);
            setSelectedDao(dao.address);
            setSelectedDaoName(dao.name);
          }}
        />
      )
    );
    return <ul>{daoItems}</ul>;
  }
};
