import {
  Box,
  Flex,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  GovernanceQueryClient,
} from "../client/Governance.client";
import {
  useGovernancePeriodInfoQuery,
  useGovernanceProposalsQuery,
} from "../client/Governance.react-query";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import {
  useIdentityserviceGetIdentityByOwnerQuery,
} from "../client/Identityservice.react-query";
import { GovHeader, JMESLogo } from "../components";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ConnectedWalletButton } from "../components/react/connected-wallet-button";
import {
  ProposalHeader,
  ProposalList,
} from "../components/react/proposal-list";
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

export default function GovernanceProposal() {
  const chainContext = useChain(chainName);
  const { address, getCosmWasmClient } = chainContext;

  const [viewDimension, setViewDimension] = useState(Array());

  useEffect(() => {
    const { innerHeight, innerWidth } = window;
    setViewDimension([innerWidth, innerHeight]);
  }, []);

  const LCDOptions = {
    URL: LCD_URL,
    chainID: CHAIN_ID,
  };

  useEffect(() => {
    const init = async () => {
      cosmWasmClient = await getCosmWasmClient();
    };
    init().catch(console.error);
  });

  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT
  );
  const identityserviceQueryClient: IdentityserviceQueryClient =
    new IdentityserviceQueryClient(cosmWasmClient, IDENTITY_SERVICE_CONTRACT);

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

  const governanceProposalQuery = useGovernanceProposalsQuery({
    client: governanceQueryClient,
    args: {},
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
      <Flex height={"23px"} />
      <GovHeader />
      <Flex height={"46px"} />
      <ProposalHeader isGov={true} />
      <Flex height={"17px"} />
      {!!governanceProposalQuery.data ? (
        <ProposalList proposals={governanceProposalQuery?.data?.proposals} isGov={true} />
      ) : (
        ""
      )}
    </Box>
  );
}

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
