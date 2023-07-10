import { Flex, Spinner, Text, Tooltip } from '@chakra-ui/react';
import {
  formatBalance,
  useAccountBalance,
} from '../../../hooks/useAccountBalance';
import { Image } from '@chakra-ui/react';
import { useMemo } from 'react';

type Props = {
  address: string;
};
export const BalanceDisplay = ({ address }: Props) => {
  const {
    data: balance,
    isLoading: fetchingBalance,
    isFetching: loadingBalance,
  } = useAccountBalance(address, 1 * 1000);
  const balanceInJmes = useMemo(() => {
    return balance?.jmes?.amount.dividedBy(10e6).toNumber() ?? 0;
  }, [balance]);
  return (
    <>
      {(fetchingBalance || loadingBalance) && !balance && (
        <Flex>
          <Text fontSize="sm"> Loading Balance ...</Text>
          <Spinner size="sm" />
        </Flex>
      )}
      {balance && (
        <Flex>
          <Flex
            borderWidth={1}
            borderStyle="solid"
            borderColor="bg.100"
            bg="white"
            rounded="full"
            px={3}
            py={2}
            alignItems="center"
          >
            <Image
              src="/Wallet.svg"
              width={'16px'}
              height={'16px'}
              mr="3"
              alt="Wallet Icon"
            />
            <Tooltip hasArrow placement="top" label={balanceInJmes}>
              <Flex alignItems="center" >
                <Image
                  src="/JMES_Icon.svg"
                  alt="JMES Icon"
                  width={'10px'}
                  mr={1}
                  height={'10px'}
                />
                <Text mr="2">{formatBalance(balanceInJmes)}</Text>
              </Flex>
            </Tooltip>
          </Flex>
        </Flex>
      )}
    </>
  );
};
