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
import { NavBarItem } from "./react/navigation-item";
import { ConnectedWalletButton } from "./react/connected-wallet-button";
import { ProposalHeader, ProposalList } from "./react/proposal-list";
import { useDaoMultisigListProposalsQuery } from "../client/DaoMultisig.react-query";
import { DaoMultisigQueryClient } from "../client/DaoMultisig.client";
import { DaoMembersList } from "./react/dao-members-list";
import { chainName } from "../config/defaults";
import { useChain } from "@cosmos-kit/react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

let cosmWasmClient: CosmWasmClient;

export const DaoProposal = ({
  daoAddress,
  daoName,
}: {
  daoAddress: string;
  daoName: string;
}) => {
  const chainContext = useChain(chainName);
  const { address, getCosmWasmClient } = chainContext;

  const [viewDimension, setViewDimension] = useState(Array());

  useEffect(() => {
    const { innerHeight, innerWidth } = window;
    setViewDimension([innerWidth, innerHeight]);
  }, []);

  useEffect(() => {
    const init = async () => {
      cosmWasmClient = await getCosmWasmClient();
    };
    init().catch(console.error);
  });

  const LCDOptions = {
    URL: LCD_URL,
    chainID: CHAIN_ID,
  };
  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT
  );

  const args = { owner: address ? address : "" };
  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient,
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
    cosmWasmClient,
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
      backgroundColor={"rgba(198, 180, 252, 0.3)"}
      paddingLeft={"54px"}
      paddingTop={"25px"}
      paddingRight={"54px"}
      overflowY="scroll"
    >
      <Flex width={"100%"}>
        {!!periodInfoQuery.data ? (
          <PeriodInfoSection
            currentCycle={
              periodInfoQuery.data?.current_period?.toString() as string
            }
            nextCycle={
              periodInfoQuery.data?.current_period?.toString() === "posting"
                ? "voting"
                : ("posting" as string)
            }
            nextCycleStart={
              periodInfoQuery.data?.current_period?.toString() === "posting"
                ? periodInfoQuery.data?.next_voting_start
                : (periodInfoQuery.data?.next_posting_start as number)
            }
          />
        ) : (
          ""
        )}
        <Spacer />
        <ConnectedWalletButton
          identityName={identityOwnerQuery.data?.identity?.name as string}
        />
      </Flex>
      <Flex height={"47px"} />
      <Text
        color={"#7453FD"}
        fontWeight="bold"
        fontFamily="DM Sans"
        fontSize={24}
      >
        {daoName}
      </Text>
      <Flex height={"46px"} />
      <Flex>
        <Box>
          <ProposalHeader isGov={false} />
          <Flex height={"17px"} />
          {!!proposalsQuery.data ? (
            <ProposalList
              proposals={proposalsQuery?.data?.proposals}
              isGov={false}
              daoAddress={daoAddress}
            />
          ) : (
            ""
          )}
        </Box>
        <Spacer />
        <DaoMembersList daoAddress={daoAddress} />
      </Flex>
    </Box>
  );
};

export const PeriodInfoSection = ({
  currentCycle,
  nextCycle,
  nextCycleStart,
}: {
  currentCycle: string;
  nextCycle: string;
  nextCycleStart: number;
}) => {
  return (
    <Flex
      width={"481px"}
      height={"42px"}
      borderColor="rgba(116, 83, 253, 0.3)"
      borderWidth={1}
      borderRadius={"90px"}
      backgroundColor="transparent"
      justifyContent={"center"}
    >
      <Text
        color="#000000"
        fontFamily={"DM Sans"}
        fontWeight="normal"
        fontSize={14}
        alignSelf="center"
      >{`Current cycle is `}</Text>
      <Text
        color="#000000"
        fontFamily={"DM Sans"}
        fontWeight="bold"
        fontSize={14}
        alignSelf="center"
        marginLeft={1}
        marginRight={1}
      >{`${currentCycle.slice(0, 1).toUpperCase()}${currentCycle.slice(
        1
      )}. `}</Text>
      <Text
        color="#000000"
        fontFamily={"DM Sans"}
        fontWeight="normal"
        fontSize={14}
        alignSelf="center"
      >{` Next cycle is ${nextCycle.slice(0, 1).toUpperCase()}${nextCycle.slice(
        1
      )} starting in ${timestampToDays(nextCycleStart).toString()}.`}</Text>

      <ChevronDownIcon
        alignSelf={"center"}
        marginLeft={"4px"}
        width={"24px"}
        height={"24px"}
        color={"#000000"}
        opacity={"70%"}
      />
    </Flex>
  );
};

const timestampToDays = (timestamp: number) => {
  const now = Date.now();
  const diff = timestamp * 1000 - now;

  const day_count = Math.ceil(diff / (1000 * 3600 * 24));
  return `${day_count} ${day_count === 1 ? "day" : "days"}`;
};
