import { useRouter } from 'next/router';
import { useIdentityContext } from '../contexts/IdentityContext';
import LoadingComponent from '../features/components/genial/LoadingMessage';
import { useEffect, useMemo } from 'react';

export const useRedirectToHomeForNoWalletConnected = () => {
  const router = useRouter();
  const { address, loadingIdentity } = useIdentityContext();

  const Loading = useMemo(() => {
    if (!address && !loadingIdentity) {
      return 'Redirecting...';
    }
    if (loadingIdentity) {
      return <LoadingComponent />;
    }
    return undefined;
  }, [address, loadingIdentity]);

  useEffect(() => {
    if (!address && !loadingIdentity) {
      router.push('/');
    }
  }, [Loading, address, loadingIdentity, router]);

  return [Loading];
};
