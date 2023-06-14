import { Box, Container, Flex, Spacer } from "@chakra-ui/react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import { chainName } from "../config/defaults";
import { Header, NavBar } from "../features";
import useClient from "../hooks/useClient";
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

export default function Home() {
  const [identityName, setIdentityName] = useState("");
  const { address, status } = useChain(chainName);

  //cleanup
  const [isConnectButtonClicked, setConnectButtonClicked] = useState(false);
  const [isGovProposalSelected, setIsGovProposalSelected] = useState(true);
  const [isCreateDaoSelected, setCreateDaoSelected] = useState(false);
  const [selectedDao, setSelectedDao] = useState("");
  const [selectedDaoName, setSelectedDaoName] = useState("");
  const [isCreateGovProposalSelected, setCreateGovProposalSelected] =
    useState(false);

  const [isDaoProposalDetailOpen, setDaoProposalDetailOpen] = useState(false);
  const [selectedDaoProposalTitle, setSelectedDaoProposalTitle] = useState("");
  const [selectedDaoMembersList, setSelectedDaoMembersList] = useState([]);
  const [isGovProposalDetailOpen, setGovProposalDetailOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(-1);
  const {
    checkIdentity,
    fetchSigningCosmClient,
    handleGetIdentity,
    fetchCosmClient,
    fetchGovernanceClient,
  } = useClient();

  useEffect(() => {
    if (status === WalletStatus.Connected) {
      const identity = handleGetIdentity() as string;
      fetchCosmClient();
      fetchSigningCosmClient();
      checkIdentity();
      fetchGovernanceClient();
      setIdentityName(identity);
    } else if (status === WalletStatus.Disconnected) {
      setCreateDaoSelected(false);
      setIsGovProposalSelected(true);
      setDaoProposalDetailOpen(false);
      setGovProposalDetailOpen(false);
    }
  }, [
    status,
    isConnectButtonClicked,
    handleGetIdentity,
    fetchCosmClient,
    fetchSigningCosmClient,
    checkIdentity,
    fetchGovernanceClient,
  ]);

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
        <NavBar
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
          setConnectButtonClicked={setConnectButtonClicked}
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
