import { Flex, Skeleton, Spinner, Text, Tooltip } from '@chakra-ui/react';
import {
  formatBalance,
  useAccountBalance,
} from '../../../hooks/useAccountBalance';
import { Image } from '@chakra-ui/react';
import { useMemo } from 'react';

type Props = {
  address: string;
  asCard?: boolean;
};
export const BalanceDisplay = ({ address, asCard }: Props) => {
  const {
    data: balance,
    isLoading: fetchingBalance,
    isFetching: loadingBalance,
  } = useAccountBalance(address, 1 * 1000);
  const balanceInJmes = useMemo(() => {
    return (
      balance?.jmes?.amount.dividedBy(1e6).toDecimalPlaces(6).toNumber() ?? 0
    );
  }, [balance]);
  return (
    <>
      {(fetchingBalance || loadingBalance) && !balance && (
        <Flex>
          <Skeleton h="30px" w="100px" />
        </Flex>
      )}
      {balance && (
        <Flex>
          <Flex
            borderWidth={asCard ? 1 : 0}
            borderStyle="solid"
            borderColor="bg.100"
            bg={asCard ? 'white' : 'transparent'}
            rounded="full"
            px={3}
            py={asCard ? 2 : 0}
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
              <Flex alignItems="center">
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
