import { Box, Container, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { LCDClient } from "@terra-money/terra.js/dist/client/lcd/LCDClient";
import {
  GovernanceClient,
  GovernanceQueryClient,
} from "../client/Governance.client";
import { useGovernancePeriodInfoQuery } from "../client/Governance.react-query";

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

  const periodInfoQuery = useGovernancePeriodInfoQuery({
    client: governanceQueryClient,
  });

  
  return (
    <Box marginTop={8}>
      <Text fontWeight="bold"> Period Info </Text>
      <Text> Current Block: {periodInfoQuery.data?.current_block} </Text>
      <Text> Current Period: {periodInfoQuery.data?.current_period} </Text>
      <Text> Current Posting Start: {timestampToDate(periodInfoQuery.data?.current_posting_start as number)} </Text>
      <Text> Current Time in Cycle: {periodInfoQuery.data?.current_time_in_cycle} </Text>
      <Text> Current Voting Start: {timestampToDate(periodInfoQuery.data?.current_voting_start as number)} </Text>
      <Text> Current Voting End: {timestampToDate(periodInfoQuery.data?.current_voting_end as number)} </Text>
      <Text> Cycle Length: {periodInfoQuery.data?.cycle_length} </Text>
      <Text> Next Posting Start: {timestampToDate(periodInfoQuery.data?.next_posting_start as number)} </Text>
      <Text> Next Voting Start: {timestampToDate(periodInfoQuery.data?.next_voting_start as number)} </Text>
      <Text> Posting Period Length: {periodInfoQuery.data?.posting_period_length} </Text>
      <Text> Voting Period Length: {periodInfoQuery.data?.voting_period_length} </Text>
    </Box>
  );
}

const timestampToDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toDateString()
}