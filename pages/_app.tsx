import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChainProvider } from '@cosmos-kit/react';
import { ChakraProvider } from '@chakra-ui/react';
import { defaultTheme } from '../config';
// import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as keplrWallets } from '@cosmos-kit/keplr-extension';

import { SignerOptions } from '@cosmos-kit/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Chain } from '@chain-registry/types';
import jmesTestnet from '../config/chains/jmes-testnet/chain.json';
import jmesAssets from '../config/chains/jmes-testnet/assetlist.json';
import { chainName } from '../config/defaults';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import OnboardingModal from '../features/Onboarding/OnboardingModal';
import { WalletModal } from '../features/Wallet/components/WalletModal';
import React, { ReactElement, useEffect } from 'react';
import { AppStateProvider } from '../contexts/AppStateContext';
import { CosmWasmClientContextProvider } from '../contexts/CosmWasmClient';
import { Container as ModalContainer } from 'react-modal-promise';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const chains: Chain[] = [jmesTestnet];
const assets = [jmesAssets];

import type { NextPage } from 'next';
import { Layout } from '../layouts/main';
import { IdentityContextProvider } from '../contexts/IdentityContext';
import { BalanceContextProvider } from '../contexts/balanceContext';
import { DAOContextProvider } from '../contexts/DAOContext';
import { SigningCosmWasmClientContextProvider } from '../contexts/SigningCosmWasmClient';
import { GasPrice } from '@cosmjs/stargate';
import { DelegateContextProvider } from '../contexts/DelegateContext';
import { ErrorBoundary } from '../error/errorBondary';
import { VotingPeriodContextProvider } from '../contexts/VotingPeriodContext';
import { ValidatorContextProvider } from '../contexts/validatorsContext';
import { LeaveConfirmContextProvider } from '../hooks/useLeaveConfirm';
import { useRouter } from 'next/router';
import { CoreSlotProposalsContextProvider } from '../contexts/CoreSlotProposalsContext';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  Layout?: ({ children }: { children: ReactElement }) => ReactElement;
};
export const queryClient = new QueryClient();

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// a day
const keplerSessionDuration = 60 * 60 * 24 * 1000;

function CreateCosmosApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const signerOptions: SignerOptions = {
    // eslint-disable-next-line   @typescript-eslint/no-unused-vars
    signingCosmwasm: (_chain: Chain) => {
      return {
        gasPrice: GasPrice.fromString('0ujmes'),
      };
    },

    preferredSignType: () => 'amino',
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loader = document.getElementById('globalLoader');
      if (loader) loader.remove();
    }
  }, []);

  return (
    <ChakraProvider
      toastOptions={{
        toastSpacing: 4,
      }}
      theme={defaultTheme}
    >
      <QueryClientProvider client={queryClient}>
        <ChainProvider
          sessionOptions={{
            duration: keplerSessionDuration,
          }}
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
              rpc: [RPC_URL],
            },
          }}
        >
          <CosmWasmClientContextProvider>
            <IdentityContextProvider>
              <BalanceContextProvider>
                <DAOContextProvider>
                  <AppStateProvider>
                    <SigningCosmWasmClientContextProvider>
                      <ValidatorContextProvider>
                        <DelegateContextProvider>
                          <VotingPeriodContextProvider>
                            <LeaveConfirmContextProvider>
                              <Layout>
                                <ErrorBoundary>
                                  <CoreSlotProposalsContextProvider>
                                    <ModalContainer />
                                    <Component
                                      key={router.asPath}
                                      {...pageProps}
                                    />
                                    <OnboardingModal />
                                  </CoreSlotProposalsContextProvider>
                                </ErrorBoundary>
                              </Layout>
                            </LeaveConfirmContextProvider>
                          </VotingPeriodContextProvider>
                        </DelegateContextProvider>
                      </ValidatorContextProvider>
                    </SigningCosmWasmClientContextProvider>
                  </AppStateProvider>
                </DAOContextProvider>
              </BalanceContextProvider>
              <ReactQueryDevtools initialIsOpen={false} />
            </IdentityContextProvider>
          </CosmWasmClientContextProvider>
        </ChainProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default CreateCosmosApp;
