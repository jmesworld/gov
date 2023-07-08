import { Flex, Spinner, Text } from '@chakra-ui/react';
import { useAccountBalance } from '../../../hooks/useAccountBalance';
import { Image } from '@chakra-ui/react';

type Props = {
  address: string;
};
export const BalanceDisplay = ({ address }: Props) => {
  const {
    data: balance,
    isLoading: fetchingBalance,
    isFetching: loadingBalance,
  } = useAccountBalance(address, 1 * 1000);

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
            borderColor="purple"
            px={3}
            alignItems="center"
          >
            <Text mr={3}>JMES</Text>
            <Image
              src="/JMES_Icon.svg"
              alt="JMES Icon"
              width={4}
              mr={1}
              height={4}
            />
            <Text> {balance?.jmes}</Text>
          </Flex>
        </Flex>
      )}
    </>
  );
};
