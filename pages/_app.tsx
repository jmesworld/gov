import "../styles/globals.css";
import type { AppProps } from "next/app";
import { WalletProvider } from "@cosmos-kit/react";
import { ChakraProvider, useQuery } from "@chakra-ui/react";
import { defaultTheme } from "../config";
import { wallets } from "@cosmos-kit/keplr";
import { SignerOptions } from "@cosmos-kit/core";
import { chains, assets } from "chain-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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
        <WalletProvider
          chains={chains}
          assetLists={assets}
          wallets={wallets}
          signerOptions={signerOptions}
        >
          <Component {...pageProps} />
        </WalletProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default CreateCosmosApp;
