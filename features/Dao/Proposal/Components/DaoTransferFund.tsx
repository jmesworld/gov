import { useEffect, useState, memo } from 'react';
import { useDebounce } from '../../../../hooks/useDebounce';
import { IdentityserviceQueryClient } from '../../../../client/Identityservice.client';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  CloseButton,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { TwoInputs } from '../../../components/genial/TwoInputs';

type Props = {
  client: IdentityserviceQueryClient;
  name?: string;
  id: string;
  address?: string | null;
  error?: string;
  amount?: number;
  onAmountChange: (id: string, value: number) => void;
  onNameChange: (id: string, value: string) => void;
  onAddress: (id: string, value?: string | null) => void;
  onErrorChange: (id: string, error?: string) => void;
  onRemove: (id: string) => void;
};

// eslint-disable-next-line react/display-name
export const DaoTransferFund = memo(
  ({
    id,
    name,
    address,
    client,
    error,
    amount,
    onAddress,
    onNameChange,
    onErrorChange,
    onAmountChange,
    onRemove,
  }: Props) => {
    const [nameValue, setNameValue] = useState<string>(name ?? '');

    const [addressValue, setAddressValue] = useState<string>(address ?? '');

    const debouncedValue = useDebounce({
      value: nameValue,
      delay: 300,
    });

    const debouncedAddressValue = useDebounce({
      value: addressValue,
      delay: 300,
    });

    const onNameValueChange = (value: string) => {
      if (name === value && value === nameValue) {
        return;
      }
      if (name && name !== value) {
        onNameChange(id, '');
        address && onAddress(id, '');
      }
      if (addressValue) {
        setAddressValue('');
      }
      setNameValue(value);
    };

    const onChangeAddress = (value: string) => {
      if (address === value && value === addressValue) {
        return;
      }
      if (address && address !== value) {
        onAddress(id, '');
        name && onNameChange(id, '');
      }

      if (nameValue) {
        onNameValueChange('');
      }
      setAddressValue(value);
    };

    // fetch by name
    const {
      data,
      isFetching,
      error: err,
    } = useQuery({
      enabled: debouncedValue === nameValue && debouncedValue !== '',
      queryKey: ['members', debouncedValue],
      queryFn: ({ queryKey }) =>
        client.getIdentityByName({ name: queryKey[1] }),
      retry: 1,
      refetchOnMount: true,
    });

    // fetch by Address
    const {
      data: addressData,
      isFetching: isFetchingAddress,
      error: addressErr,
    } = useQuery({
      enabled:
        debouncedAddressValue === addressValue && debouncedAddressValue !== '',
      queryKey: ['address', debouncedAddressValue],
      queryFn: ({ queryKey }) =>
        client.getIdentityByOwner({ owner: queryKey[1] }),
      retry: 1,
      refetchOnMount: true,
    });

    useEffect(() => {
      if (!data) {
        return;
      }
      if (debouncedValue !== nameValue) {
        return;
      }
      if (!data.identity) {
        return;
      }
      onNameChange(id, data.identity.name);
      onAddress(id, data.identity.owner);
    }, [data, debouncedValue, id, onAddress, nameValue, onNameChange]);

    useEffect(() => {
      if (!addressData) {
        return;
      }
      if (debouncedAddressValue !== addressValue) {
        return;
      }
      if (!addressData.identity) {
        return;
      }
      onNameChange(id, addressData.identity.name);
      onAddress(id, addressData.identity.owner);
    }, [
      addressData,
      addressValue,
      debouncedAddressValue,
      id,
      onAddress,
      onNameChange,
    ]);

    useEffect(() => {
      if (err instanceof Error) {
        onErrorChange(err.message);
        return;
      }
      if (addressErr instanceof Error) {
        onErrorChange(addressErr.message);
        return;
      }
      onErrorChange(id, undefined);
    }, [err, addressErr, id, onErrorChange]);

    return (
      <Box>
        <Flex key={id} marginBottom={'3px'}>
          <Flex mr={2} flexGrow={1}>
            <TwoInputs
              value={[name || nameValue, address || addressValue]}
              onchange={[onNameValueChange, onChangeAddress]}
            />
          </Flex>
          <InputGroup width={'202px'} height={'48px'} marginRight={'16px'}>
            <Input
              variant={'outline'}
              width={'202px'}
              height={'100%'}
              borderColor={'primary.500'}
              background={'primary.100'}
              focusBorderColor="darkPurple"
              borderRadius={12}
              color={'purple'}
              fontWeight={'normal'}
              value={amount}
              type={'number'}
              onChange={e => {
                const power = Number(e.target.value) ?? 0;
                onAmountChange(id, power);
              }}
            />

            <InputLeftElement height={'100%'}>
              <Image
                src="/JMES_Icon.svg"
                alt="JMES Icon"
                width={4}
                mr={1}
                height={4}
              />
            </InputLeftElement>
          </InputGroup>

          <CloseButton
            size={'24px'}
            _hover={{ backgroundColor: 'transparent' }}
            color={'rgba(15,0,86,0.3)'}
            onClick={() => {
              onRemove(id);
            }}
          />
        </Flex>
        <Text
          mb="3px"
          height="22px"
          fontSize="small"
          color={'purple'}
          fontFamily="DM Sans"
          fontWeight="normal"
        >
          {(isFetching || isFetchingAddress) &&
            address === undefined &&
            'loading...'}
          {error}
          {!address &&
            !error &&
            !(isFetching || isFetchingAddress) &&
            'Not Found'}
        </Text>
      </Box>
    );
  },
);
