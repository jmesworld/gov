import { Governance } from '../features';
import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';
import { useRouter } from 'next/router';
import { CoinSupplyContextProvider } from '../contexts/CoinSupply';

const { WinningGrantProposals } = Governance;

const Funded = () => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const router = useRouter();

  return (
    <CoinSupplyContextProvider>
      {cosmWasmClient && (
        <WinningGrantProposals
          cosmWasmClient={cosmWasmClient}
          setSelectedProposalId={(id: number) => {
            router.push(`/proposals/${id}`);
          }}
        />
      )}
    </CoinSupplyContextProvider>
  );
};
export default Funded;
