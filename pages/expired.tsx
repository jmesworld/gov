import { Governance } from '../features';
import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';
import { NextPageWithLayout } from './_app';
import { CoinSupplyContextProvider } from '../contexts/CoinSupply';

const { ArchivedProposal } = Governance;

const Home: NextPageWithLayout = () => {
  const { cosmWasmClient } = useCosmWasmClientContext();

  return (
    <CoinSupplyContextProvider>
      {cosmWasmClient && (
        <ArchivedProposal
          title="EXPIRED PROPOSALS"
          tab="expired"
          status="expired_concluded"
          cosmWasmClient={cosmWasmClient}
          setSelectedProposalId={() => {
            // router.push(`/proposals/${id}`);
          }}
        />
      )}
    </CoinSupplyContextProvider>
  );
};
export default Home;
