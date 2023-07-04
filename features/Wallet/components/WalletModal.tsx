import { useChain } from '@cosmos-kit/react';
import { chainName } from '../../../config/defaults';

export const WalletModal = () => {
  const { closeView } = useChain(chainName);
  closeView();
  return <></>;
};
