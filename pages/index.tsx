import { Governance } from '../features';
import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';
import { NextPageWithLayout } from './_app';
import { useRouter } from 'next/router';

const { GovernanceProposal } = Governance;

const Home: NextPageWithLayout = () => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const router = useRouter();

  return (
    <>
      {!cosmWasmClient && 'loading ...'}
      {cosmWasmClient && (
        <GovernanceProposal
          cosmWasmClient={cosmWasmClient}
          setSelectedProposalId={(id: number) => {
            router.push(`/proposals/${id}`);
          }}
        />
      )}
    </>
  );
};
export default Home;
