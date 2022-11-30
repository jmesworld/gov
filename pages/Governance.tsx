import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Link,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { LCDClient } from "@terra-money/terra.js/dist/client/lcd/LCDClient";
import { Fragment } from "react";
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

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export default function Governance() {
  const walletManager = useWallet();
  const { walletStatus, address } = walletManager;

  const LCDOptions = {
    URL: LCD_URL,
    chainID: CHAIN_ID,
  };
  const lcdClient = new LCDClient(LCDOptions);
  const governanceQueryClient = new GovernanceQueryClient(
    lcdClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT
  );
  const identityserviceQueryClient: IdentityserviceQueryClient =
    new IdentityserviceQueryClient(lcdClient, IDENTITY_SERVICE_CONTRACT);

  const periodInfoQuery = useGovernancePeriodInfoQuery({
    client: governanceQueryClient,
    options: {
      refetchInterval: 10,
    },
  });

  const coreSlotQuery = useGovernanceCoreSlotsQuery({
    client: governanceQueryClient,
    options: {
      refetchInterval: 10,
    },
  });

  const brandCoreSlotIdentityQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceQueryClient,
    args: {
      owner: coreSlotQuery.data?.brand?.dao as string,
    },
    options: {
      refetchInterval: 10,
      enabled: !!coreSlotQuery.data?.brand?.dao,
    },
  });

  const coreTechCoreSlotIdentityQuery =
    useIdentityserviceGetIdentityByOwnerQuery({
      client: identityserviceQueryClient,
      args: {
        owner: coreSlotQuery.data?.core_tech?.dao as string,
      },
      options: {
        refetchInterval: 10,
        enabled: !!coreSlotQuery.data?.core_tech?.dao,
      },
    });

  const creativeCoreSlotIdentityQuery =
    useIdentityserviceGetIdentityByOwnerQuery({
      client: identityserviceQueryClient,
      args: {
        owner: coreSlotQuery.data?.creative?.dao as string,
      },
      options: {
        refetchInterval: 10,
        enabled: !!coreSlotQuery.data?.creative?.dao,
      },
    });

  const governanceProposalQuery = useGovernanceProposalsQuery({
    client: governanceQueryClient,
    args: {},
    options: {},
  });

  return (
    <Fragment>
      <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(1, 1fr)">
        <GridItem colSpan={1}>
          <Box marginTop={8}>
            <Text fontWeight="bold"> Period Info </Text>
            <Text> Current Block: {periodInfoQuery.data?.current_block} </Text>
            <Text>
              {" "}
              Current Period: {periodInfoQuery.data?.current_period}{" "}
            </Text>
            <Text>
              {" "}
              Current Posting Start:{" "}
              {timestampToDate(
                periodInfoQuery.data?.current_posting_start as number
              )}{" "}
            </Text>
            <Text>
              {" "}
              Current Time in Cycle:{" "}
              {periodInfoQuery.data?.current_time_in_cycle}{" "}
            </Text>
            <Text>
              {" "}
              Current Voting Start:{" "}
              {timestampToDate(
                periodInfoQuery.data?.current_voting_start as number
              )}{" "}
            </Text>
            <Text>
              {" "}
              Current Voting End:{" "}
              {timestampToDate(
                periodInfoQuery.data?.current_voting_end as number
              )}{" "}
            </Text>
            <Text> Cycle Length: {periodInfoQuery.data?.cycle_length} </Text>
            <Text>
              {" "}
              Next Posting Start:{" "}
              {timestampToDate(
                periodInfoQuery.data?.next_posting_start as number
              )}{" "}
            </Text>
            <Text>
              {" "}
              Next Voting Start:{" "}
              {timestampToDate(
                periodInfoQuery.data?.next_voting_start as number
              )}{" "}
            </Text>
            <Text>
              {" "}
              Posting Period Length:{" "}
              {periodInfoQuery.data?.posting_period_length}{" "}
            </Text>
            <Text>
              {" "}
              Voting Period Length: {
                periodInfoQuery.data?.voting_period_length
              }{" "}
            </Text>
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Box marginTop={8}>
            <Text fontWeight="bold"> Core Slots </Text>
            <Text>
              {" "}
              Brand: {brandCoreSlotIdentityQuery.data?.identity?.name}{" "}
            </Text>
            <Text>
              {" "}
              Core Tech: {
                coreTechCoreSlotIdentityQuery.data?.identity?.name
              }{" "}
            </Text>
            <Text>
              {" "}
              Creative: {
                creativeCoreSlotIdentityQuery.data?.identity?.name
              }{" "}
            </Text>
          </Box>
        </GridItem>
      </Grid>
      <Text fontWeight="bold" fontSize={24} marginTop={12}>
        {" "}
        Governance Proposals{" "}
      </Text>
      <Flex marginTop={4} justifyContent="left">
        {governanceProposalQuery.data ? (
          governanceProposalQuery.data?.proposal_count > 0 ? (
            governanceProposalQuery?.data?.proposals?.map((proposal: any) => (
              <NextLink
                key={proposal.id}
                href={{
                  pathname: "/GovProposalDetail",
                  query: { id: proposal.id, address: proposal.dao as string },
                }}
                passHref={true}
              >
                <Link fontSize={24}>
                  <Flex>
                    <Text
                      marginRight={4}
                      fontSize={18}
                      fontWeight="medium"
                    >{`#${proposal.id}`}</Text>
                    <Box
                      height={54}
                      width={1000}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize={18} key={proposal.id}>
                        {proposal.title}
                      </Text>
                    </Box>
                  </Flex>
                </Link>
              </NextLink>
            ))
          ) : (
            <Flex justifyContent="center" width="100%">
              <Text> No proposal has been created yet </Text>
            </Flex>
          )
        ) : (
          <Spinner color="red.500" />
        )}
      </Flex>
    </Fragment>
  );
}

const timestampToDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toDateString();
};
