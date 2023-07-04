import React, { useEffect, useState } from 'react';
import {
  Text,
  useColorMode,
  Button,
  Icon,
  useClipboard,
} from '@chakra-ui/react';
import { FiCopy } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';

type CopyAddressType = {
  address?: string;
  isLoading?: boolean;
  maxDisplayLength?: number;
  isRound?: boolean;
};

function handleChangeColorModeValue(
  colorMode: string,
  light: string,
  dark: string,
) {
  if (colorMode === 'light') return light;
  if (colorMode === 'dark') return dark;
}

function stringTruncateFromCenter(str: string, maxLength: number) {
  const midChar = '…'; // character to insert into the center of the result

  if (str.length <= maxLength) return str;

  // length of beginning part
  const left = Math.ceil(maxLength / 2);

  // start index of ending part
  const right = str.length - Math.floor(maxLength / 2) + 1;

  return str.substring(0, left) + midChar + str.substring(right);
}

export const CopyAddressButton = ({
  address,
  isLoading,
  isRound,
  maxDisplayLength,
}: CopyAddressType) => {
  const { hasCopied, onCopy } = useClipboard(address ? address : '');
  const [displayAddress, setDisplayAddress] = useState('');
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!address) setDisplayAddress('address not identified yet');
    if (address && maxDisplayLength)
      setDisplayAddress(stringTruncateFromCenter(address, maxDisplayLength));
    if (address && !maxDisplayLength)
      setDisplayAddress(stringTruncateFromCenter(address, 24));
  }, [address, maxDisplayLength]);
  return (
    <Button
      title={address}
      variant="unstyled"
      display="flex"
      alignItems="center"
      justifyContent="start"
      borderRadius={isRound ? 'full' : 'lg'}
      border="0px solid"
      bg="bg"
      padding="12px"
      borderColor={handleChangeColorModeValue(
        colorMode,
        'darkPurple',
        'darkPurple',
      )}
      w="full"
      h={'38px'}
      minH="fit-content"
      color={handleChangeColorModeValue(colorMode, 'darkPurple', 'darkPurple')}
      transition="all .3s ease-in-out"
      isDisabled={!address && true}
      isLoading={isLoading}
      _hover={{
        bg: 'bg',
      }}
      _focus={{
        outline: 'none',
      }}
      _disabled={{
        opacity: 0.6,
        cursor: 'not-allowed',
        borderColor: 'rgba(142, 142, 142, 0.1)',
        _hover: {
          bg: 'transparent',
        },
        _active: {
          outline: 'none',
        },
        _focus: {
          outline: 'none',
        },
      }}
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
        onCopy();
      }}
    >
      <Text
        fontSize="sm"
        fontWeight="normal"
        letterSpacing="0.4px"
        opacity={0.75}
        marginRight={2}
      >
        {displayAddress}
      </Text>
      {address && (
        <Icon
          as={hasCopied ? FaCheckCircle : FiCopy}
          w={4}
          h={4}
          ml={2}
          opacity={0.9}
          color={
            hasCopied
              ? 'green.400'
              : handleChangeColorModeValue(
                  colorMode,
                  'darkPurple',
                  'darkPurple',
                )
          }
        />
      )}
    </Button>
  );
};
