import { useEffect, useState, ChangeEvent, memo, useMemo } from 'react';
import { useDebounce } from '../../../../hooks/useDebounce';
import { IdentityserviceQueryClient } from '../../../../client/Identityservice.client';
import {
  Box,
  CloseButton,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { TwoInputs } from '../../../components/genial/TwoInputs';
import { numberWithDecimals } from '../../../../utils/numberValidators';
import { NumericFormat } from 'react-number-format';
import { useIdentityFetch } from '../../../../hooks/useIdentityFetch';

interface BaseProps {
  client: IdentityserviceQueryClient;
  name?: string;
  id: string;
  address?: string | null;
  error?: string;
  amount?: number | '';
  notCancelable?: boolean;
  isDirty?: boolean;
  maxAmount?: number;
}

interface ReadOnlyProps extends BaseProps {
  readonly?: undefined;
  onAmountChange: (id: string, value: number | '') => void;
  onNameChange: (id: string, value: string) => void;
  onAddress: (id: string, value?: string | null) => void;
  onErrorChange: (id: string, error?: string) => void;
  onRemove: (id: string) => void;
}

interface NotReadOnlyProps extends BaseProps {
  readonly: true;
  onAmountChange?: never;
  onNameChange?: never;
  onAddress?: never;
  onErrorChange?: never;
  onRemove?: never;
}

type Props = ReadOnlyProps | NotReadOnlyProps;

// eslint-disable-next-line react/display-name
export const DaoTransferFund = memo(
  ({
    id,
    notCancelable,
    name,
    address,
    client,
    error,
    amount,
    readonly,
    isDirty,
    maxAmount,
    ...rest
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
      if (value === '') {
        setAddressValue('');
        address && rest.onAddress && rest.onAddress(id, '');
      }
      if (name === value && value === nameValue) {
        return;
      }
      setNameValue(value);
      setAddressValue('');
      if (addressValue) {
        setAddressValue('');
      }
      if (readonly) {
        return;
      }
      if (name && name !== value) {
        rest.onNameChange && rest.onNameChange(id, '');
        address && rest.onAddress && rest.onAddress(id, '');
      }
    };

    const onChangeAddress = (value: string) => {
      if (address === value && value === addressValue) {
        return;
      }
      setAddressValue(value);
      if (readonly) {
        return;
      }
      if (address && address !== value) {
        name && rest.onNameChange && rest.onNameChange(id, '');
      }

      if (nameValue) {
        onNameValueChange('');
      }
    };
    // fetch by name
    const {
      data,
      isFetching,
      error: err,
    } = useIdentityFetch({
      client,
      enabled: debouncedValue === nameValue && debouncedValue !== '',
      value: debouncedValue,
      type: 'name',
    });

    // fetch by Address
    const {
      data: addressData,
      isFetching: isFetchingAddress,
      error: addressErr,
    } = useIdentityFetch({
      enabled:
        debouncedAddressValue === addressValue && debouncedAddressValue !== '',
      value: debouncedAddressValue,
      client,
      type: 'address',
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
      if (readonly) {
        return;
      }
      rest.onNameChange && rest.onNameChange(id, data.identity.name);
      rest.onAddress && rest.onAddress(id, data.identity.owner);
    }, [data, debouncedValue, id, nameValue, readonly, rest]);

    useEffect(() => {
      if (!addressData) {
        return;
      }
      if (readonly) {
        setNameValue(addressData?.identity?.name || '');
        return;
      }
      if (debouncedAddressValue !== addressValue) {
        return;
      }
      if (!addressData.identity) {
        return;
      }

      rest.onNameChange && rest.onNameChange(id, addressData.identity.name);
      rest.onAddress && rest.onAddress(id, addressData.identity.owner);
    }, [addressData, addressValue, debouncedAddressValue, id, readonly, rest]);

    useEffect(() => {
      if (err instanceof Error && !readonly) {
        rest.onErrorChange && rest.onErrorChange(err.message);
        return;
      }
      if (addressErr instanceof Error && !readonly) {
        rest.onErrorChange && rest.onErrorChange(addressErr.message);
        return;
      }
      !readonly && rest.onErrorChange && rest.onErrorChange(id, undefined);
    }, [err, addressErr, id, readonly, rest]);

    const notFoundError = useMemo(() => {
      if (!name && !address && !nameValue && !addressValue) {
        return null;
      }
      if (
        !address &&
        nameValue &&
        !error &&
        !(isFetching || isFetchingAddress)
      ) {
        return 'Not found';
      }
      if (!name && !address) {
        return 'Not found';
      }
      if (
        addressValue !== address &&
        address &&
        nameValue === '' &&
        !(isFetching || isFetchingAddress)
      ) {
        return 'Address not found';
      }
      return null;
    }, [
      address,
      addressValue,
      error,
      isFetching,
      isFetchingAddress,
      name,
      nameValue,
    ]);

    const nameMemo = useMemo(() => {
      if (readonly) {
        return nameValue;
      }
      return name || nameValue || addressValue;
    }, [name, nameValue, addressValue, readonly]);

    const addressMemo = useMemo(() => {
      if (readonly) {
        return addressValue;
      }
      return name || nameValue ? (address || addressValue) ?? '' : '';
    }, [readonly, name, nameValue, address, addressValue]);

    const onChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/,/g, '');
      if (numberWithDecimals(6).safeParse(value).success) {
        !readonly &&
          rest.onAmountChange &&
          rest.onAmountChange(id, Number(value));
      }
      if (value === '') {
        !readonly && rest.onAmountChange && rest.onAmountChange(id, '');
      }
    };

    const amountinValid = useMemo(() => {
      if (!maxAmount) {
        return false;
      }
      return maxAmount && (amount || 0) > maxAmount;
    }, [amount, maxAmount]);

    return (
      <Box>
        <Flex key={id} marginBottom={'3px'} mb={readonly ? '10px' : '10px'}>
          <Flex mr={2} flexGrow={1}>
            <TwoInputs
              isLoading={isFetching || isFetchingAddress}
              error={
                isDirty || nameMemo || addressMemo
                  ? (error || notFoundError) ?? undefined
                  : undefined
              }
              value={[nameMemo, addressMemo]}
              onchange={[onNameValueChange, onChangeAddress]}
            />
          </Flex>
          <InputGroup
            width={'202px'}
            height={'48px'}
            marginRight={notCancelable ? '34px' : readonly ? '0px' : '16px'}
          >
            <NumericFormat
              customInput={Input}
              paddingLeft={'42px'}
              decimalScale={6}
              thousandSeparator
              width={'202px'}
              value={amount}
              isInvalid={amountinValid}
              onChange={onChangeAmount}
              variant={'outline'}
              background={'background.100'}
              boxShadow="none"
              errorBorderColor="red"
              borderColor={amountinValid ? 'red' : 'background.500'}
              focusBorderColor={amountinValid ? 'red' : 'darkPurple'}
              _invalid={{
                boxShadow: 'none',
              }}
              _focus={{
                boxShadow: 'none',
              }}
              _hover={{
                borderColor: amountinValid ? 'red' : 'darkPurple',
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
          {!notCancelable && !readonly && (
            <CloseButton
              size={'24px'}
              _hover={{ backgroundColor: 'transparent' }}
              color={'rgba(15,0,86,0.3)'}
              onClick={() => {
                !readonly && rest.onRemove && rest.onRemove(id);
              }}
            />
          )}
        </Flex>
      </Box>
    );
  },
);
