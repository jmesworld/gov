import Head from "next/head";
import { Container } from "@chakra-ui/react";
import { WalletSection } from "../components";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../client/Identityservice.react-query";
import Governance from "./Governance";
import LandingPage from "./LandingPage";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../config/defaults";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useEffect } from "react";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;
const NEXT_PUBLIC_BJMES_TOKEN_CONTRACT = process.env
  .NEXT_PUBLIC_BJMES_TOKEN_CONTRACT as string;

let cosmWasmClient: CosmWasmClient;

export default function Home() {
  const chainContext = useChain(chainName);
  const { address, isWalletConnected, getCosmWasmClient } = chainContext;

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

  const args = { owner: address ? address : "" };
  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
  );

  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client,
    args,
  });

  return (
    <Container maxW="100%" maxH="100%" padding={0}>
      <Head>
        <title>JMES Coin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isWalletConnected &&
      identityOwnerQuery.data?.identity?.owner === address ? (
        <Governance />
      ) : (
        <LandingPage />
      )}
      {/* <Governance/> */}
    </Container>
  );
}
