import { useRouter } from 'next/router';
import { useIdentityContext } from '../contexts/IdentityContext';
import LoadingComponent from '../features/components/genial/LoadingMessage';
import { useEffect, useMemo } from 'react';
import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';

export const useRedirectToHomeForNoWalletConnected = () => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const router = useRouter();
  const { address, loadingIdentity } = useIdentityContext();
  const Loading = useMemo(() => {
    if (!cosmWasmClient) {
      return <LoadingComponent />;
    }
    if (!address) {
      return 'Redirecting...';
    }
    if (loadingIdentity) {
      return <LoadingComponent />;
    }
    return undefined;
  }, [address, cosmWasmClient, loadingIdentity]);

  useEffect(() => {
    if (!cosmWasmClient) {
      return;
    }
    if (!address) {
      router.push('/');
    }
  }, [Loading, address, cosmWasmClient, loadingIdentity, router]);

  return [Loading];
};
