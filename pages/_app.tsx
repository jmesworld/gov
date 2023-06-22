import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainProvider } from "@cosmos-kit/react";
import { Box, ChakraProvider, Modal } from "@chakra-ui/react";
import { defaultTheme } from "../config";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { SignerOptions } from "@cosmos-kit/core";
import { assets } from "chain-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Chain } from "@chain-registry/types";
import jmesTestnet from "../config/chains/jmes-testnet/chain.json";
import { chainName } from "../config/defaults";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
//import OnboardingModal from "../features/Onboarding/OnboardingModal";
import { WalletModal } from "../features/Wallet/components/WalletModal";
import { CosmWasmProvider } from "../contexts/ClientContext";
import { WalletViewProps } from "@cosmos-kit/core";
import React from "react";
const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const chains: Chain[] = [jmesTestnet];

function CreateCosmosApp({ Component, pageProps }: AppProps) {
  const signerOptions: SignerOptions = {
    // stargate: (_chain: Chain) => {
    //   return getSigningCosmosClientOptions();
    // }
  };

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={defaultTheme}>
        <ChainProvider
          chains={chains}
          assetLists={assets}
          wallets={[...keplrWallets]}
          walletModal={undefined}
          modalViews={{
            Connected: WalletModal,
          }}
          signerOptions={signerOptions}
          endpointOptions={{
            [chainName]: {
              rpc: [LCD_URL],
            },
          }}
        >
          <CosmWasmProvider>
            <Component {...pageProps} />
          </CosmWasmProvider>
        </ChainProvider>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default CreateCosmosApp;
