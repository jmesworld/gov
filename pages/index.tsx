import { Governance } from '../features';
import { Delegate } from '../features/Delegate/delegate';
import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';
import { NextPageWithLayout } from './_app';
import { useRouter } from 'next/router';

const { GovernanceProposal } = Governance;

const Home: NextPageWithLayout = () => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const router = useRouter();

  const onClose = () => {
    router.back();
  };

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
      {router.query.modal && router.query.modal === 'delegate' && (
        <Delegate onClose={onClose} />
      )}
    </>
  );
};
export default Home;
