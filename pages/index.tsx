import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useChain } from '@cosmos-kit/react';
import { useEffect, useMemo } from 'react';
import { chainName, IDENTITY_SERVICE_CONTRACT } from '../config/defaults';
import { Governance } from '../features';

import { Delegate } from '../features/Delegate/delegate';
import { IdentityserviceQueryClient } from '../client/Identityservice.client';
import { useIdentityserviceGetIdentityByOwnerQuery } from '../client/Identityservice.react-query';
import { useMyDaosList } from '../hooks/useMyDaosList';
import { useAppState } from '../contexts/AppStateContext';
import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';
import { NextPageWithLayout } from './_app';
import { useRouter } from 'next/router';

const { GovernanceProposal } = Governance;

const Home: NextPageWithLayout = () => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const router = useRouter();

  const { setSelectedDaoName, setSelectedDao, setIdentityName } = useAppState();

  const { address } = useChain(chainName);

  const identityserviceClient = useMemo(
    () =>
      cosmWasmClient
        ? new IdentityserviceQueryClient(
            cosmWasmClient as CosmWasmClient,
            IDENTITY_SERVICE_CONTRACT,
          )
        : undefined,
    [cosmWasmClient],
  );

  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceClient,
    args: { owner: address as string },
    options: {
      refetchOnMount: true,
    },
  });
  const identityName = identityOwnerQuery?.data?.identity?.name;

  useEffect(() => {
    identityName && setIdentityName(identityName);
  }, [identityName, setIdentityName]);
  // -- End of temporary fix ---

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
