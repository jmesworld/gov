import { memo, useMemo } from 'react';
import { IdentityserviceQueryClient } from '../../../../client/Identityservice.client';
import {
  Box,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { TwoInputs } from '../../../components/genial/TwoInputs';
import { NumericFormat } from 'react-number-format';
import { useIdentityFetch } from '../../../../hooks/useIdentityFetch';

interface Props {
  client: IdentityserviceQueryClient;
  id: string;
  address: string;
  amount: number | '';
}

// eslint-disable-next-line react/display-name
export const ShowDaoTransferFund = memo(
  ({
    id,

    address,
    client,

    amount,
  }: Props) => {
    // fetch by Address
    const {
      data: addressData,
      isFetching: isFetchingAddress,
      error: addressErr,
    } = useIdentityFetch({
      enabled: address !== '',
      value: address,
      client,
      type: 'address',
    });

    const error = useMemo(() => {
      if (!addressData) {
        return null;
      }
      if (addressData.identity === null) {
        return 'Not found';
      }
      if (addressData.identity?.owner !== address) {
        return 'Not found';
      }
      if (addressErr instanceof Error) {
        return addressErr.message;
      }

      return null;
    }, [address, addressData, addressErr]);

    const nameMemo = useMemo(() => {
      if (!addressData) {
        return '';
      }
      return addressData?.identity?.name ?? '';
    }, [addressData]);

    return (
      <Box>
        <Flex key={id} marginBottom={'3px'} mb={'10px'}>
          <Flex mr={2} flexGrow={1}>
            <TwoInputs
              isLoading={isFetchingAddress}
              error={nameMemo ? error ?? undefined : undefined}
              value={[nameMemo, address]}
            />
          </Flex>
          <InputGroup width={'202px'} height={'48px'}>
            <NumericFormat
              customInput={Input}
              paddingLeft={'42px'}
              decimalScale={6}
              thousandSeparator
              width={'202px'}
              value={amount}
              readonly
              variant={'outline'}
              background={'background.100'}
              boxShadow="none"
              errorBorderColor="red"
              borderColor={'background.500'}
              focusBorderColor={'darkPurple'}
              _invalid={{
                boxShadow: 'none',
              }}
              _focus={{
                boxShadow: 'none',
              }}
              _hover={{
                borderColor: 'darkPurple',
              }}
              borderRadius={12}
              color={'purple'}
              height={'100%'}
              fontWeight={'normal'}
            />

            <InputLeftElement width="42px" height={'100%'}>
              <Image
                src="/JMES_Icon.svg"
                alt="JMES Icon"
                width={4}
                height={4}
              />
            </InputLeftElement>
          </InputGroup>
        </Flex>
      </Box>
    );
  },
);
