import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GovernanceQueryClient } from "../client/Governance.client";
import { useGovernanceProposalsQuery } from "../client/Governance.react-query";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../client/Identityservice.react-query";
import { GovHeader } from "../components";
import {
  ProposalHeader,
  ProposalList,
} from "../components/react/proposal-list";
import { chainName } from "../config/defaults";
import { useChain } from "@cosmos-kit/react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import PeriodInfo from "../components/react/period-info";
import { ConnectWalletSection } from "../components/react/connect-wallet-section";

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export default function GovernanceProposal({
  identityName,
  identityBalance,
}: {
  identityName: string;
  identityBalance: string;
}) {
  const { address, status, getCosmWasmClient } = useChain(chainName);

  const [viewDimension, setViewDimension] = useState(Array());

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

  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT
  );
  const identityserviceQueryClient: IdentityserviceQueryClient =
    new IdentityserviceQueryClient(
      cosmWasmClient as CosmWasmClient,
      IDENTITY_SERVICE_CONTRACT
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
        />
      </Flex>
      <Flex height={"35px"} />
      <GovHeader />
      <Flex height={"46px"} />
      <ProposalHeader isGov={true} />
      <Flex height={"10px"} />
      {!!governanceProposalQuery.data ? (
        <ProposalList
          proposals={governanceProposalQuery?.data?.proposals}
          isGov={true}
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
            Loading Governance proposals...
          </Text>
        </Flex>
      )}
    </Box>
  );
}
