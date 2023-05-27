import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Link,
  Spacer,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import {
  GovernanceClient,
  GovernanceQueryClient,
} from "../client/Governance.client";
import {
  useGovernanceCoreSlotsQuery,
  useGovernancePeriodInfoQuery,
  useGovernanceProposalsQuery,
} from "../client/Governance.react-query";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import {
  useIdentityserviceDaosQuery,
  useIdentityserviceGetIdentityByOwnerQuery,
} from "../client/Identityservice.react-query";
import NextLink from "next/link";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { NavBarItem } from "../components/react/navigation-item";
import { ConnectedWalletButton } from "../components/react/connected-wallet-button";
import {
  ProposalHeader,
  ProposalList,
} from "../components/react/proposal-list";
import { useDaoMultisigListProposalsQuery } from "../client/DaoMultisig.react-query";
import { DaoMultisigQueryClient } from "../client/DaoMultisig.client";
import { DaoMembersList } from "../components/react/dao-members-list";
import { chainName } from "../config/defaults";
import { useChain } from "@cosmos-kit/react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { ConnectButton } from "../components/react/connect-wallet-button";
import PeriodInfo from "../components/react/period-info";
import { ConnectWalletSection } from "../components/react/connect-wallet-section";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export default function DaoProposal({
  daoAddress,
  daoName,
  identityName,
  identityBalance,
  isConnectButtonClicked,
  setConnectButtonClicked,
  setDaoProposalDetailOpen,
  setSelectedDaoProposalTitle,
  setSelectedDaoMembersList,
  setSelectedProposalId,
}: {
  daoAddress: string;
  daoName: string;
  identityName: string;
  identityBalance: string;
  isConnectButtonClicked: boolean;
  setConnectButtonClicked: Function;
  setDaoProposalDetailOpen: Function;
  setSelectedDaoProposalTitle: Function;
  setSelectedDaoMembersList: Function;
  setSelectedProposalId: Function
}) {
  const chainContext = useChain(chainName);
  const { address, getCosmWasmClient } = chainContext;

  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  useEffect(() => {
    if (address) {
      getCosmWasmClient()
        .then((cosmWasmClient) => {
          if (!cosmWasmClient) {
            return;
          }
          setCosmWasmClient(cosmWasmClient);
        })
        .catch((error) => console.log(error));
    }
  }, [address, getCosmWasmClient]);

  const LCDOptions = {
    URL: LCD_URL,
    chainID: CHAIN_ID,
  };
  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT
  );

  const args = { owner: address ? address : "" };
  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
  );

  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client,
    args,
  });

  const periodInfoQuery = useGovernancePeriodInfoQuery({
    client: governanceQueryClient,
    options: {
      refetchInterval: 10,
    },
  });

  const daoQueryClient = new DaoMultisigQueryClient(
    cosmWasmClient as CosmWasmClient,
    daoAddress as string
  );
  const proposalsQuery = useDaoMultisigListProposalsQuery({
    client: daoQueryClient,
    args: { limit: 10000 },
    options: {
      refetchInterval: 10,
    },
  });

  return (
    <Box
      width={"100%"}
      height={"100%"}
      paddingLeft={"54px"}
      paddingTop={"25px"}
      paddingRight={"54px"}
      overflowY="scroll"
    >
      <Flex width={"100%"}>
        <PeriodInfo />
        <Spacer />
        <ConnectWalletSection
          identityName={identityName}
          identityBalance={identityBalance}
          isConnectButtonClicked={isConnectButtonClicked}
          setConnectButtonClicked={setConnectButtonClicked}
        />
      </Flex>
      <Flex height={"47px"} />
      <Text
        color={"darkPurple"}
        fontWeight="bold"
        fontSize={28}
        fontFamily="DM Sans"
      >
        {daoName}
      </Text>
      <Flex height={"46px"} />
      <Flex>
        <Box>
          <ProposalHeader isGov={false} />
          <Flex height={"10px"} />
          {!!proposalsQuery.data ? (
            <ProposalList
              proposals={proposalsQuery?.data?.proposals}
              isGov={false}
              daoAddress={daoAddress}
              onClickListItem={() => {
                setDaoProposalDetailOpen(true);
              }}
              setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
              setSelectedProposalId={setSelectedProposalId}
            />
          ) : (
            <Flex justifyContent="center" width="100%">
              <Text
                color="rgba(15,0,86,0.8)"
                fontFamily={"DM Sans"}
                fontWeight="normal"
                fontStyle={"italic"}
                fontSize={14}
                marginTop={"24px"}
              >
                Loading DAO proposals...
              </Text>
            </Flex>
          )}
        </Box>
        <Spacer />
        <DaoMembersList
          daoAddress={daoAddress}
          setSelectedDaoMembersList={setSelectedDaoMembersList}
        />
      </Flex>
    </Box>
  );
}
