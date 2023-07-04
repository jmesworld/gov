import { Governance } from '../features';
import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';
import { NextPageWithLayout } from './_app';
import { useRouter } from 'next/router';
import { CoinSupplyContextProvider } from '../contexts/CoinSupply';

const { GovernanceProposal } = Governance;

const Home: NextPageWithLayout = () => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const router = useRouter();

  return (
    <CoinSupplyContextProvider>
      {!cosmWasmClient && 'loading ...'}
      {cosmWasmClient && (
        <GovernanceProposal
          cosmWasmClient={cosmWasmClient}
          setSelectedProposalId={(id: number) => {
            router.push(`/proposals/${id}`);
          }}
        />
      )}
    </CoinSupplyContextProvider>
  );
};
export default Home;
