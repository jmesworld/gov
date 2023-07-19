import { Flex, Skeleton, Spacer, Spinner } from '@chakra-ui/react';

import Wallet from '../Wallet/Wallet';
import PeriodInfo from './components/PeriodInfo';
import { useCosmWasmClientContext } from '../../contexts/CosmWasmClient';

const Header = () => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  return (
    <Flex width={'100%'}>
      {cosmWasmClient && <PeriodInfo />}
      <Spacer />
      <Wallet />
    </Flex>
  );
};

export default Header;
