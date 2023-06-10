import { Box, Container, Flex, Spacer } from "@chakra-ui/react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import { chainName } from "../config/defaults";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../client/Identityservice.react-query";
import { useAccountBalance } from "../hooks/useAccountBalance";
import { addJMEStoKeplr, checkJMESInKeplr } from "../actions/keplr";
import Header from "../features/Header/Header";
import Sidebar from "../components/NavBar/NavBar";

const DaoProposalDetail = dynamic(
  () => import("../features/Dao/DaoProposalDetail")
);
const GovProposalDetail = dynamic(
  () => import("../features/Governance/GovProposalDetail")
);
const GovernanceProposal = dynamic(
  () => import("../features/Governance/GovernanceProposal")
);
const CreateDao = dynamic(() => import("../features/Dao/CreateDao"));
const DaoProposal = dynamic(() => import("../features/Dao/DaoProposal"));
const CreateGovProposal = dynamic(
  () => import("../features/Governance/CreateGovProposal")
);

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

export default function Home() {
  const [isJMESInKeplr, setJMESInKeplr] = useState(null || Boolean);
  const [isNewDataUpdated, setDataUpdated] = useState(false);
  const [identityBalance, setIdentityBalance] = useState("");
  const [identityName, setIdentityName] = useState("");
  const { address, status, getCosmWasmClient } = useChain(chainName);
  const identityBalanceQuery = useAccountBalance(address as string);

  //cleanup
  const [isConnectButtonClicked, setConnectButtonClicked] = useState(false);
  const [isGovProposalSelected, setIsGovProposalSelected] = useState(true);
  const [isCreateDaoSelected, setCreateDaoSelected] = useState(false);
  const [selectedDao, setSelectedDao] = useState("");
  const [selectedDaoName, setSelectedDaoName] = useState("");
  const [isCreateGovProposalSelected, setCreateGovProposalSelected] =
    useState(false);
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  const [isDaoProposalDetailOpen, setDaoProposalDetailOpen] = useState(false);
  const [selectedDaoProposalTitle, setSelectedDaoProposalTitle] = useState("");
  const [selectedDaoMembersList, setSelectedDaoMembersList] = useState([]);
  const [isGovProposalDetailOpen, setGovProposalDetailOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(-1);

  const identityserviceQueryClient: IdentityserviceQueryClient =
    new IdentityserviceQueryClient(
      cosmWasmClient as CosmWasmClient,
      IDENTITY_SERVICE_CONTRACT
    );

  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceQueryClient,
    args: { owner: address ? address : "" },
    options: {
      refetchInterval: 5000,
      onSuccess: (data) => {
        setIdentityName(data?.identity?.name as string);
      },
    },
  });

  const fetchIdentity = async () => {
    const identity = await identityOwnerQuery.refetch();
    const balance: any = identityBalanceQuery.data ?? 0;

    setIdentityName(identity?.data?.identity?.name as string);
    setIdentityBalance(balance);

    if (status === WalletStatus.Connected && !isJMESInKeplr) {
      checkJMESInKeplr()
        .then((val) => setJMESInKeplr(val))
        .catch((error) => console.log(error));
    } else if (status === WalletStatus.Connected && isJMESInKeplr) {
      if (balance === 0) {
        addJMEStoKeplr()
          .then((val) => setJMESInKeplr(val))
          .catch((error) => console.log(error));
      }
    } else {
      setJMESInKeplr(false);
    }

    if (isNewDataUpdated) {
      setDataUpdated(false);
    } else {
      setDataUpdated(true);
    }

    return identity;
  };

  useEffect(() => {
    fetchIdentity();
  });

  useEffect(() => {
    if (status == WalletStatus.Disconnected) {
      setCreateDaoSelected(false);
      setIsGovProposalSelected(true);
      setDaoProposalDetailOpen(false);
      setGovProposalDetailOpen(false);
    }
  }, [status]);

  useEffect(() => {
    if (!isJMESInKeplr && isConnectButtonClicked) {
      checkJMESInKeplr()
        .then((val) => setJMESInKeplr(val))
        .catch((error) => console.log(error));
    }
  }, [isJMESInKeplr, isConnectButtonClicked]);

  return (
    <Container
      maxW="100%"
      padding={0}
      backgroundColor={"rgba(198, 180, 252, 0.3)"}
    >
      <Head>
        <title>JMES Governance</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex padding={0} width={"100vw"} height={"100vh"}>
        <Sidebar
          status={status}
          address={address}
          identityName={identityName}
          isGovProposalSelected={isGovProposalSelected}
          setIsGovProposalSelected={setIsGovProposalSelected}
          isCreateDaoSelected={isCreateDaoSelected}
          setCreateDaoSelected={setCreateDaoSelected}
          setSelectedDao={setSelectedDao}
          setSelectedDaoName={setSelectedDaoName}
          setCreateGovProposalSelected={setCreateGovProposalSelected}
          setDaoProposalDetailOpen={setDaoProposalDetailOpen}
          setGovProposalDetailOpen={setGovProposalDetailOpen}
          selectedDao={selectedDao}
          selectedDaoName={selectedDaoName}
          setConnectButtonClicked={setConnectButtonClicked} //this
        />
        <Box
          width={"100%"}
          height={"100%"}
          paddingLeft={"54px"}
          paddingTop={"25px"}
          paddingRight={"54px"}
          overflowY="scroll"
        >
          <Flex width={"100%"}>
            <Spacer />
            <Header />
          </Flex>

          {isGovProposalDetailOpen ? (
            <GovProposalDetail proposalId={selectedProposalId} />
          ) : isDaoProposalDetailOpen ? (
            <DaoProposalDetail
              selectedDao={selectedDao}
              selectedDaoName={selectedDaoName}
              selectedDaoProposalTitle={selectedDaoProposalTitle}
              selectedDaoMembersList={selectedDaoMembersList}
              selectedDaoProposalId={selectedProposalId}
            />
          ) : isCreateGovProposalSelected ? (
            <CreateGovProposal
              selectedDao={selectedDao}
              selectedDaoName={selectedDaoName}
              setCreateGovProposalSelected={setCreateGovProposalSelected}
            />
          ) : isCreateDaoSelected ? (
            <CreateDao
              identityName={identityName}
              setCreateDaoSelected={setCreateDaoSelected}
            />
          ) : isGovProposalSelected ? (
            <GovernanceProposal
              setSelectedProposalId={setSelectedProposalId}
              setGovProposalDetailOpen={setGovProposalDetailOpen}
            />
          ) : (
            <DaoProposal
              daoAddress={selectedDao}
              daoName={selectedDaoName}
              setDaoProposalDetailOpen={setDaoProposalDetailOpen}
              setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
              setSelectedDaoMembersList={setSelectedDaoMembersList}
              setSelectedProposalId={setSelectedProposalId}
            />
          )}
        </Box>
      </Flex>
    </Container>
  );
}
