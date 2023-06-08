import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainProvider } from "@cosmos-kit/react";
import { ChakraProvider, useQuery } from "@chakra-ui/react";
import { defaultTheme } from "../config";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { SignerOptions } from "@cosmos-kit/core";
import { assets } from "chain-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Chain } from "@chain-registry/types";
import jmesTestnet from "../config/chains/jmes-testnet/chain.json";
import { chainName } from "../config/defaults";
import { KeplrExtensionWallet } from '@cosmos-kit/keplr-extension';

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
          signerOptions={signerOptions}
          endpointOptions={{
            [chainName]: {
              rpc: [LCD_URL],
            },
          }}
        >
          <Component {...pageProps} />
        </ChainProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default CreateCosmosApp;
