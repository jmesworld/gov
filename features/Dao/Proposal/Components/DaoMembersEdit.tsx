import React, { useEffect, useState, memo } from 'react';
import { useDebounce } from '../../../../hooks/useDebounce';
import { IdentityserviceQueryClient } from '../../../../client/Identityservice.client';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { useClipboardTimeout } from '../../../../hooks/useClipboard';
import {
  numberWithNoDecimals,
  onNumberWithNoDecimalKeyDown,
} from '../../../../utils/numberValidators';

type Props = {
  removeCopy?: boolean;
  client: IdentityserviceQueryClient;
  isReadOnly: boolean;
  name?: string;
  id: string;
  address?: string | null;
  error?: string;
  votingPower?: number;
  onVotingPowerChange: (id: string, value: number | '') => void;
  onNameChange: (id: string, value: string) => void;
  onAddress: (id: string, value?: string | null) => void;
  onErrorChange: (id: string, error?: string) => void;
  onRemove: (id: string) => void;
};

// eslint-disable-next-line react/display-name
export const MemberUpdate = memo(
  ({
    id,
    name,
    address,
    isReadOnly,
    client,
    error,
    votingPower,
    onAddress,
    onNameChange,
    onErrorChange,
    onVotingPowerChange,
    onRemove,
    removeCopy,
  }: Props) => {
    const [copied, onCopy] = useClipboardTimeout();
    const [value, setValue] = useState<string>(name ?? '');

    const debouncedValue = useDebounce({
      value,
      delay: 300,
    });

    const {
      data,
      isFetching,
      error: err,
    } = useQuery({
      enabled: !isReadOnly && debouncedValue === value && debouncedValue !== '',
      queryKey: ['members', debouncedValue],
      queryFn: ({ queryKey }) =>
        client.getIdentityByName({ name: queryKey[1] }),
      retry: 1,
      refetchOnMount: true,
    });
    useEffect(() => {
      if (!data) {
        return;
      }
      if (debouncedValue !== value) {
        return;
      }

      onAddress(id, data.identity?.owner ?? null);
    }, [data, debouncedValue, id, onAddress, value]);

    useEffect(() => {
      if (err instanceof Error) {
        onErrorChange(err.message);
        return;
      }
      onErrorChange(id, undefined);
    }, [err, id, onErrorChange]);

    const onChangeVotingPower = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (numberWithNoDecimals.safeParse(value).success) {
        onVotingPowerChange(id, Number(value));
        return;
      }
      if (value === '') {
        onVotingPowerChange(id, '');
        return;
      }
      e.preventDefault();
    };

    return (
      <Flex key={id} w="full" marginBottom={'16px'}>
        <InputGroup width={'85%'} height={'48px'}>
          <Input
            spellCheck="false"
            isReadOnly={isReadOnly}
            isInvalid={!!error}
            variant={'outline'}
            borderColor={'primary.500'}
            background={'primary.100'}
            focusBorderColor="darkPurple"
            borderRadius={12}
            color={'purple'}
            height={'100%'}
            defaultValue={value}
            fontWeight={'normal'}
            onChange={e => {
              setValue(e.target.value);
              onNameChange(id, e.target.value);
              onAddress(id, undefined);
            }}
          />
          <InputRightElement
            width="77%"
            mr="6"
            pl="3"
            background={'primary.100'}
            display="flex"
            justifyContent="flex-start"
            height={'80%'}
            my="auto"
            top="5px"
          >
            <Flex
              width="2px"
              height="50%"
              bg="purple"
              marginRight="-1px"
              marginY="auto"
            />
            <Flex width="full" ml="4" justifyContent="space-between">
              <Text
                color={'purple'}
                fontFamily="DM Sans"
                fontSize={16}
                textAlign="left"
                fontWeight="normal"
              >
                {isFetching && address === undefined && 'loading...'}
                {error}
                {!!address && !error && address}
                {address === null && 'Not Found'}
              </Text>
              {address && !removeCopy && (
                <Flex>
                  <Image
                    onClick={() => {
                      onCopy(address);
                    }}
                    src="/copy.svg"
                    alt="copy"
                  />
                  <Text fontSize="sm">{copied && 'Copied'}</Text>
                </Flex>
              )}
              {!address && <span />}
            </Flex>
          </InputRightElement>
        </InputGroup>
        <InputGroup pl="10px" width={'13%'} height={'48px'}>
          <Input
            variant={'outline'}
            width={'100%'}
            height={'100%'}
            borderColor={'primary.500'}
            background={'primary.100'}
            focusBorderColor="darkPurple"
            borderRadius={12}
            textAlign="center"
            color={'purple'}
            fontWeight={'normal'}
            value={votingPower}
            onKeyDown={onNumberWithNoDecimalKeyDown}
            type={'number'}
            onChange={onChangeVotingPower}
          />

          <InputRightElement width="30%" height={'100%'}>
            <Text
              mr="20px"
              textAlign="left"
              color={'purple'}
              fontFamily="DM Sans"
              fontSize={16}
              fontWeight="normal"
            >
              %
            </Text>
          </InputRightElement>
        </InputGroup>

        <Button
          p="0"
          ml="5px"
          width={'24px'}
          size="24px"
          bg="transparent"
          _focus={{ backgroundColor: 'transparent' }}
          _hover={{ backgroundColor: 'transparent' }}
          color={'rgba(15,0,86,0.3)'}
          onClick={() => {
            onRemove(id);
          }}
        >
          {!isReadOnly && (
            <Image
              src="/CloseFilled.svg"
              width="24px"
              height="24px"
              alt="close"
            />
          )}
        </Button>
      </Flex>
    );
  },
);
