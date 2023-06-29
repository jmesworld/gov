import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Governance } from '../features';

import { Delegate } from '../features/Delegate/delegate';
import { useMyDaosList } from '../hooks/useMyDaosList';
import { useAppState } from '../contexts/AppStateContext';
import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';
import { NextPageWithLayout } from './_app';
import { useRouter } from 'next/router';
import { useIdentityContext } from '../contexts/IdentityContext';

const { GovernanceProposal } = Governance;

const Home: NextPageWithLayout = () => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const { address } = useIdentityContext();
  const router = useRouter();

  const { setSelectedDaoName, setSelectedDao } = useAppState();

  // This essentially triggers a function that updates the user's list of daos in the backgroud. Could be improved
  useMyDaosList(
    address as string,
    cosmWasmClient as CosmWasmClient,
    setSelectedDao,
    setSelectedDaoName,
    () => {
      router.push('/');
    },
  );
  // ---- End of code to be improved ------

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
