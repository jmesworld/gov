import { Box, Container, Flex, Spacer } from "@chakra-ui/react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { chainName, IDENTITY_SERVICE_CONTRACT, rpc } from "../config/defaults";
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
import CreateDaoForm from "../features/Dao/CreateDaoForm";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../client/Identityservice.react-query";
import { useMyDaosList } from "../hooks/useMyDaosList";

const { DaoProposal } = Dao;

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
  //const { identityName, identityOwnerQuery } = useClientIdentity(); <---- hook does not return up-to-date query result

  //TODO: @hunter - please fix/remove L44-L71 once useClientIdenitity() hook's behaviour is stable. Adding this temporarily
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  useEffect(() => {
    CosmWasmClient.connect(rpc)
      .then((cosmWasmClient) => {
        if (!cosmWasmClient) {
          return;
        }
        setCosmWasmClient(cosmWasmClient);
      })
      .catch((error) => console.log(error));
  }, []);
  const identityserviceClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
  );
  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceClient,
    args: { owner: address as string },
    options: {
      refetchOnMount: true,
    },
  });
  const identityName = identityOwnerQuery?.data?.identity?.name;
  // -- End of temporary fix ---

  // This essentially triggers a function that updates the user's list of daos in the backgroud. Could be improved
  const myDaos = useMyDaosList(
    address as string,
    cosmWasmClient as CosmWasmClient,
    setSelectedDao,
    setSelectedDaoName,
    () => {
      // reset state
      setIsGovProposalSelected(false);
      setCreateDaoSelected(false);
      setDaoProposalDetailOpen(false);
      setGovProposalDetailOpen(false);
    }
  );
  
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
            identityName={identityName}
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
                  name: identityName as string,
                  votingPower: 0,
                }}
                identityName={identityName as string}
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
                daoOwner={{
                  address: address as string,
                  name: identityName as string,
                  votingPower: 0,
                }}
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
