import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChainProvider } from '@cosmos-kit/react';
import { ChakraProvider } from '@chakra-ui/react';
import { defaultTheme } from '../config';
// import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as keplrWallets } from '@cosmos-kit/keplr-extension';

import { SignerOptions } from '@cosmos-kit/core';
import { assets } from 'chain-registry';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Chain } from '@chain-registry/types';
import jmesTestnet from '../config/chains/jmes-testnet/chain.json';
import { chainName } from '../config/defaults';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import OnboardingModal from '../features/Onboarding/OnboardingModal';
import { WalletModal } from '../features/Wallet/components/WalletModal';
import { CosmWasmProvider } from '../contexts/ClientContext';
import React, { ReactElement } from 'react';
import { AppStateProvider } from '../contexts/AppStateContext';
import { CosmWasmClientContextProvider } from '../contexts/CosmWasmClient';
const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const chains: Chain[] = [jmesTestnet];

import type { NextPage } from 'next';
import { Layout } from '../layouts/main';
import { IdentityContextProvider } from '../contexts/IdentityContext';
import { BalanceContextProvider } from '../contexts/balanceContext';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  Layout?: ({ children }: { children: ReactElement }) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CreateCosmosApp({ Component, pageProps }: AppPropsWithLayout) {
  const signerOptions: SignerOptions = {
    // stargate: (_chain: Chain) => {
    //   return getSigningCosmosClientOptions();
    // }
  };
  // const Layout = ({ children }: { children: ReactElement }) =>
  // eslint-disable-next-line react/no-children-prop
  // Component.Layout ? <Component.Layout children={children} /> : children;
  const queryClient = new QueryClient();

  return (
    <>
      <ChakraProvider theme={defaultTheme}>
        <QueryClientProvider client={queryClient}>
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
            <CosmWasmClientContextProvider>
              <IdentityContextProvider>
                <BalanceContextProvider>
                  <CosmWasmProvider>
                    <AppStateProvider>
                      <Layout>
                        <>
                          <Component {...pageProps} />
                          <OnboardingModal />
                        </>
                      </Layout>
                    </AppStateProvider>
                  </CosmWasmProvider>
                </BalanceContextProvider>
                <ReactQueryDevtools initialIsOpen={false} />
              </IdentityContextProvider>
            </CosmWasmClientContextProvider>
          </ChainProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </>
  );
}

export default CreateCosmosApp;
