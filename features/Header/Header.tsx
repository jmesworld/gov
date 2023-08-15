import { Flex, Spacer } from '@chakra-ui/react';

import Wallet from '../Wallet/Wallet';
import PeriodInfo from './components/PeriodInfo';
import { useCosmWasmClientContext } from '../../contexts/CosmWasmClient';

const Header = () => {
  const { cosmWasmClient } = useCosmWasmClientContext();
  return (
    <Flex width={'100%'} pb="1.5">
      {cosmWasmClient && <PeriodInfo />}
      <Spacer />
      <Wallet />
    </Flex>
  );
};

export default Header;
