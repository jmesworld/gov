import { useRouter } from 'next/router';
import { useIdentityContext } from '../contexts/IdentityContext';
import LoadingComponent from '../features/components/genial/LoadingMessage';
import { useMemo } from 'react';

export const useRedirectToHomeForNoWalletConnected = () => {
  const router = useRouter();
  const { address, loadingIdentity } = useIdentityContext();

  const Loading = useMemo(() => {
    if (!address) {
      router.push('/');
      return 'Redirecting...';
    }
    if (loadingIdentity) {
      return <LoadingComponent message="Loading..." />;
    }
    return undefined;
  }, [address, loadingIdentity, router]);

  return [Loading];
};
