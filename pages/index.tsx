import {
  Box,
  Container,
  Flex,
  Spacer,
  useBreakpointValue,
} from "@chakra-ui/react";
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
import DaoProposalDetail from "../features/Dao/components/DaoProposalDetail";
import { useAppState } from "../contexts/AppStateContext";

const { DaoProposal } = Dao;
const { MobileViewDisabled } = Onboarding;
const { CreateGovProposal, GovProposalDetail, GovernanceProposal } = Governance;

export default function Home() {
  const { isConnectButtonClicked, setConnectButtonClicked } = useAppState();
  const { isGovProposalSelected, setIsGovProposalSelected } = useAppState();
  const { isCreateDaoSelected, setCreateDaoSelected } = useAppState();
  const { selectedDao, setSelectedDao } = useAppState();
  const { selectedDaoName, setSelectedDaoName } = useAppState();
  const { isCreateGovProposalSelected, setCreateGovProposalSelected } =
    useAppState();
  const { selectedDaoProposalTitle, setSelectedDaoProposalTitle } =
    useAppState();
  const { selectedDaoMembersList, setSelectedDaoMembersList } = useAppState();
  const { isDaoProposalDetailOpen, setDaoProposalDetailOpen } = useAppState();
  const { isGovProposalDetailOpen, setGovProposalDetailOpen } = useAppState();
  const { selectedProposalId, setSelectedProposalId } = useAppState();

  const { address, status } = useChain(chainName);
  const { identityName, identityOwnerQuery } = useClientIdentity();

  //TODO: @hunter - This essentially triggers a function that updates the user's list of daos in the backgroud. Could be improved
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
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
  // ---- End of code to be improved ------

  const isMobileView = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {isMobileView ? (
        <MobileViewDisabled />
      ) : (
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
              identityName={identityName as string}
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
              {isGovProposalDetailOpen && (
                <GovProposalDetail proposalId={selectedProposalId} />
              )}

              {isDaoProposalDetailOpen && (
                <DaoProposalDetail
                  selectedDao={selectedDao}
                  selectedDaoName={selectedDaoName}
                  selectedDaoProposalTitle={selectedDaoProposalTitle}
                  selectedDaoMembersList={selectedDaoMembersList}
                  selectedDaoProposalId={selectedProposalId}
                />
              )}

              {isCreateGovProposalSelected && (
                <CreateGovProposal
                  selectedDao={selectedDao}
                  selectedDaoName={selectedDaoName}
                  setCreateGovProposalSelected={setCreateGovProposalSelected}
                />
              )}

              {isCreateDaoSelected && (
                <CreateDaoForm
                  daoOwner={{
                    address: address as string,
                    name: identityName as string,
                    votingPower: 0,
                  }}
                  setCreateDaoSelected={setCreateDaoSelected}
                />
              )}

              {isGovProposalSelected && (
                <GovernanceProposal
                  setSelectedProposalId={setSelectedProposalId}
                  setGovProposalDetailOpen={setGovProposalDetailOpen}
                />
              )}

              {!isGovProposalDetailOpen &&
                !isDaoProposalDetailOpen &&
                !isCreateGovProposalSelected &&
                !isCreateDaoSelected &&
                !isGovProposalSelected && (
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
      )}
    </>
  );
}
