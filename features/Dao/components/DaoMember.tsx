import { useEffect, useState, memo } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { IdentityserviceQueryClient } from '../../../client/Identityservice.client';
import { useQuery } from '@tanstack/react-query';
import {
  CloseButton,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';

type Props = {
  client: IdentityserviceQueryClient;
  isReadOnly: boolean;
  name?: string;
  id: string;
  address?: string | null;
  error?: string;
  votingPower?: number;
  onVotingPowerChange: (id: string, value: number) => void;
  onNameChange: (id: string, value: string) => void;
  onAddress: (id: string, value?: string | null) => void;
  onErrorChange: (id: string, error?: string) => void;
  onRemove: (id: string) => void;
};

// eslint-disable-next-line react/display-name
export const Member = memo(
  ({
    id,
    name,
    address,
    onAddress,
    isReadOnly,
    onNameChange,
    onErrorChange,
    client,
    error,
    votingPower,
    onVotingPowerChange,
    onRemove,
  }: Props) => {
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

    return (
      <Flex key={id} marginBottom={'16px'}>
        <InputGroup width={'650px'} height={'48px'}>
          <Input
            spellCheck="false"
            isReadOnly={isReadOnly}
            isInvalid={!!error}
            variant={'outline'}
            borderColor={'primary.500'}
            background={'primary.100'}
            focusBorderColor="darkPurple"
            borderRadius={12}
            marginRight={'16px'}
            color={'darkPurple'}
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
            width="65%"
            justifyContent={'start'}
            height={'100%'}
          >
            <Text
              color={'purple'}
              fontFamily="DM Sans"
              fontSize={16}
              fontWeight="normal"
            >
              {isFetching && address === undefined && 'loading...'}
              {error}
              {!!address && !error && address}
              {address === null && 'Not Found'}
            </Text>
          </InputRightElement>
        </InputGroup>
        <InputGroup width={'102px'} height={'48px'} marginRight={'16px'}>
          <Input
            variant={'outline'}
            width={'102px'}
            height={'100%'}
            borderColor={'primary.500'}
            background={'primary.100'}
            focusBorderColor="darkPurple"
            borderRadius={12}
            color={'purple'}
            fontWeight={'normal'}
            value={votingPower}
            type={'number'}
            onChange={e => {
              const power = Number(e.target.value) ?? 0;
              onVotingPowerChange(id, power);
            }}
          />

          <InputRightElement height={'100%'}>
            <Text
              color={'purple'}
              fontFamily="DM Sans"
              fontSize={16}
              fontWeight="normal"
            >
              %
            </Text>
          </InputRightElement>
        </InputGroup>
        {!isReadOnly && (
          <CloseButton
            size={'24px'}
            _hover={{ backgroundColor: 'transparent' }}
            color={'rgba(15,0,86,0.3)'}
            onClick={() => {
              onRemove(id);
            }}
          />
        )}
      </Flex>
    );
  },
);
