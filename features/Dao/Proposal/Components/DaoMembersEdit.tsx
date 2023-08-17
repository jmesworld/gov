import React, { useEffect, useState, memo } from 'react';
import { useDebounce } from '../../../../hooks/useDebounce';
import { IdentityserviceQueryClient } from '../../../../client/Identityservice.client';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Flex,
  Image,
  InputGroup,
  InputRightElement,
  Text,
  Tooltip,
  useToken,
} from '@chakra-ui/react';
import { useClipboardTimeout } from '../../../../hooks/useClipboard';
import {
  numberWithNoDecimals,
  onNumberWithNoDecimalKeyDown,
} from '../../../../utils/numberValidators';
import CopyIcon from '../../../../assets/icons/copy.svg';
import CheckIcon from '../../../../assets/icons/CheckFilled.svg';
import { truncateFromMiddle } from '../../../../utils/truncateString';
import { InputStyled } from '../../../components/common/Input';
import { useIdentityFetch } from '../../../../hooks/useIdentityFetch';

type Props = {
  removeCopy?: boolean;
  client: IdentityserviceQueryClient;
  isReadOnly: boolean;
  fetchName?: boolean;
  name?: string;
  id: string;
  address?: string | null;
  error?: string;
  votingPower?: number;
  nonClosable?: boolean;
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
    fetchName,
    nonClosable,
  }: Props) => {
    const [copied, onCopy] = useClipboardTimeout();
    const [value, setValue] = useState<string>(name ?? '');

    const [purple, green] = useToken('colors', ['purple', 'darkGreen']);

    const debouncedValue = useDebounce({
      value,
      delay: 300,
    });
    const {
      data,
      isFetching,
      error: err,
    } = useIdentityFetch({
      client,
      enabled:
        (fetchName || !isReadOnly) &&
        debouncedValue === value &&
        debouncedValue !== '',
      value: debouncedValue,
      type: debouncedValue.length < 20 ? 'name' : 'address',
    });

    useEffect(() => {
      if (!data) {
        return;
      }
      if (debouncedValue !== value) {
        return;
      }

      onAddress(id, data.identity?.owner ?? null);
      value.length > 20 && setValue(data.identity?.name ?? '');
      value.length > 20 && onNameChange(id, data.identity?.name ?? '');
    }, [data, debouncedValue, id, name, onAddress, onNameChange, value]);

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

    const addressError = !!error || address === null;
    const votingPowerError = (votingPower ?? 0) > 100;

    return (
      <Flex key={id} w="full" marginBottom={'16px'}>
        <InputGroup width={'85%'} height={'48px'}>
          <InputStyled
            isReadOnly={isReadOnly}
            isInvalid={addressError}
            borderRadius={12}
            defaultValue={value}
            value={value}
            onChange={e => {
              setValue(e.target.value);
              onNameChange(id, e.target.value);
              onAddress(id, undefined);
            }}
            paddingRight={'80%'}
            placeholder="Enter name "
          />
          <InputRightElement
            width="77%"
            mr="6"
            pl="3"
            background={'background.100'}
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
            <Flex
              flexWrap="wrap"
              width="full"
              ml="4"
              justifyContent="space-between"
            >
              <Text
                color={'purple'}
                fontFamily="DM Sans"
                fontSize={16}
                width={'90%'}
                textAlign="left"
                noOfLines={1}
                wordBreak="break-all"
                fontWeight="normal"
              >
                {isFetching && address === undefined && 'loading...'}
                {error}
                {!!address && !error && truncateFromMiddle(address, 50)}
                {address === null && 'Not Found'}
              </Text>
              {address && !removeCopy && (
                <Tooltip
                  hasArrow
                  isOpen={copied || undefined}
                  label={copied ? 'Copied!' : 'Copy Address'}
                  aria-label="A tooltip"
                  placement="top"
                >
                  <Flex alignItems="center" justifyContent="center">
                    {!copied && (
                      <Flex
                        onClick={() => {
                          onCopy(address ?? '');
                        }}
                        alignItems="center"
                        justify="center"
                        width="24px"
                        height="24px"
                      >
                        <CopyIcon color={purple} width="22px" height="22px" />
                      </Flex>
                    )}
                    {copied && (
                      <Flex
                        alignItems="center"
                        justify="center"
                        width="24px"
                        height="24px"
                      >
                        <CheckIcon color={green} width="18px" height="18px" />
                      </Flex>
                    )}
                  </Flex>
                </Tooltip>
              )}
              {!address && <span />}
            </Flex>
          </InputRightElement>
        </InputGroup>
        <InputGroup
          pl="10px"
          width={nonClosable ? '15%' : '13%'}
          height={'48px'}
        >
          <InputStyled
            isInvalid={votingPowerError}
            value={votingPower}
            onKeyDown={onNumberWithNoDecimalKeyDown}
            type={'number'}
            paddingRight={'40%'}
            onChange={onChangeVotingPower}
            textAlign="center"
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

        {!nonClosable && (
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
        )}
      </Flex>
    );
  },
);
