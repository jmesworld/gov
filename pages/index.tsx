import { Box, Container, Flex, Spacer } from "@chakra-ui/react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { chainName } from "../config/defaults";
//import { useCosmWasmClient } from "../contexts/ClientContext";
import { useClientIdentity } from "../hooks/useClientIdentity";
import {
  NavBar,
  Header,
  Dao,
  Governance,
  Onboarding,
  Wallet,
} from "../features";

import SpendDaoFundsForm from "../features/Dao/SpendDaoFundsForm";

const { DaoProposal, CreateDaoForm } = Dao;

const { CreateGovProposal, GovProposalDetail, GovernanceProposal } = Governance;

export default function Home() {
  const [isConnectButtonClicked, setConnectButtonClicked] = useState(false);
  const [isGovProposalSelected, setIsGovProposalSelected] = useState(true);
  const [isCreateDaoSelected, setCreateDaoSelected] = useState(false);
  const [selectedDao, setSelectedDao] = useState("");
  const [selectedDaoName, setSelectedDaoName] = useState("");
  const [isCreateGovProposalSelected, setCreateGovProposalSelected] =
    useState(false);
  const [selectedDaoProposalTitle, setSelectedDaoProposalTitle] = useState("");
  const [selectedDaoMembersList, setSelectedDaoMembersList] = useState([]);
  const [isDaoProposalDetailOpen, setDaoProposalDetailOpen] = useState(false);
  const [isGovProposalDetailOpen, setGovProposalDetailOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(-1);

  const { address, status } = useChain(chainName);

  return (
    <>
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
            identityName={""}
            isCreateGovProposalSelected={isCreateGovProposalSelected}
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
              // <DaoProposalDetail
              //   selectedDao={selectedDao}
              //   selectedDaoName={selectedDaoName}
              //   selectedDaoProposalTitle={selectedDaoProposalTitle}
              //   selectedDaoMembersList={selectedDaoMembersList}
              //   selectedDaoProposalId={selectedProposalId}
              // />
              // <SpendDaoFunds
              //   selectedDao={selectedDao}
              //   selectedDaoName={selectedDaoName}
              //   setCreateGovProposalSelected={setCreateGovProposalSelected}
              // />
              <SpendDaoFundsForm
                daoOwner={{
                  address: address as string,
                  name: "",
                  votingPower: 0,
                }}
                identityName={""}
                setCreateDaoSelected={setCreateDaoSelected}
                selectedDao={selectedDao}
                selectedDaoName={selectedDaoName}
              />
            ) : isCreateGovProposalSelected ? (
              <CreateGovProposal
                selectedDao={selectedDao}
                selectedDaoName={selectedDaoName}
                setCreateGovProposalSelected={setCreateGovProposalSelected}
              />
            ) : isCreateDaoSelected ? (
              <CreateDaoForm
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
    </>
  );
}
