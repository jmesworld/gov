import { ChevronUpIcon } from '@chakra-ui/icons';
import {
  Flex,
  Text,
  Image,
  Button,
  Menu,
  MenuItem,
  MenuList,
  Spacer,
  Divider,
  Tooltip,
  MenuButton,
  useMenu,
  Box,
} from '@chakra-ui/react';

import { ConnectedWalletType } from '../../types';
import { formatBalance } from '../../../hooks/useAccountBalance';
import { useIdentityContext } from '../../../contexts/IdentityContext';
import { RefObject } from 'react';
import { CopyAddressButton } from './CopyAddressButton';
import { useDelegateContext } from '../../../contexts/DelegateContext';

export const ConnectedWalletButton = ({
  identityName,
  identityBalance,
  identityStake,
  isLoading,
  isDisabled,
}: ConnectedWalletType) => {
  const { address, disconnect } = useIdentityContext();
  const { openDelegate } = useDelegateContext();
  const { isOpen, onToggle, buttonRef } = useMenu({
    defaultIsOpen: false,
  });
  const handleDisconnect = () => {
    disconnect?.();
  };
  const identityBalanceInt = parseInt(identityBalance as string);
  const identityStakeInt = parseInt(identityStake as string);
  return (
    <Menu isOpen={isOpen}>
      <Flex
        id="id"
        ref={buttonRef as unknown as RefObject<HTMLDivElement>}
        onClick={e => {
          onToggle();
          e.preventDefault();
        }}
        cursor="pointer"
        _hover={{ bg: 'white' }}
        _expanded={{ bg: 'white' }}
        backgroundColor="white"
        borderColor="rgba(116, 83, 253, 0.3)"
        as={Button}
        isLoading={isLoading}
        isDisabled={isDisabled}
        rightIcon={
          <ChevronUpIcon
            alignSelf={'center'}
            width={'24px'}
            height={'24px'}
            color={'#7453FD'}
            transition="all .25s ease"
            transform={`${!isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}`}
          />
        }
        maxW={'400px'}
        minW={'271px'}
        height={'48px'}
        variant={'outline'}
        borderWidth={'1px'}
        borderRadius={'90px'}
      >
        <Flex width={'100%'} alignItems={'center'}>
          <Image
            src="/Wallet.svg"
            width={'16px'}
            height={'16px'}
            alt="Wallet Icon"
          />
          <Text
            color="#7453FD"
            fontWeight="bold"
            fontSize={12}
            marginLeft={'5.3px'}
            fontFamily="DM Sans"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            maxW={'100px'}
          >
            {identityName ? identityName : address}
          </Text>
          <Spacer marginLeft={'13px'} />
          <Tooltip
            label={`JMES ${identityBalanceInt} `}
            hasArrow
            placement="bottom"
          >
            <Flex>
              <Image
                src="/JMES_Icon.svg"
                alt="JMES Icon"
                width={'9px'}
                height={'10.98px'}
              />
              <Text
                color="#0F0056"
                fontWeight="bold"
                fontSize={12}
                marginLeft={'5px'}
                noOfLines={1}
                fontFamily="DM Sans"
              >{`${
                identityBalance
                  ? formatBalance(identityBalance as number)
                  : '0.0'
              }`}</Text>
            </Flex>
          </Tooltip>

          <Divider
            orientation="vertical"
            backgroundColor={'lilac'}
            height={'22px'}
            marginLeft={'5px'}
            marginRight={'9px'}
          />
          <Tooltip
            label={`bJMES ${identityStakeInt}`}
            hasArrow
            placement="bottom"
          >
            <Flex>
              <Image
                src="/JMES_bonded_icon.svg"
                alt="JMES bonded Icon"
                width={'12px'}
                height={'13px'}
              />
              <Text
                color="midnight"
                fontWeight="bold"
                fontSize={12}
                marginLeft={'5px'}
                noOfLines={1}
                fontFamily="DM Sans"
              >{`${
                identityStake ? formatBalance(identityStake as number) : '0.0'
              }`}</Text>
            </Flex>
          </Tooltip>
        </Flex>
      </Flex>
      <MenuButton
        height={'1px'}
        mt="0px!important"
        display="block"
        pos="relative"
        top="0"
      />
      <MenuList
        backgroundColor="white"
        _hover={{ bg: 'white' }}
        borderColor="rgba(116, 83, 253, 0.3)"
        borderWidth={1}
        width={'100%'}
        position="relative"
        borderRadius={'8px'}
        padding={0}
        right={0}
        top={0}
        minW={'271px'}
        maxW={'400px'}
      >
        <MenuItem
          backgroundColor="white"
          padding="2"
          _hover={{ bg: 'white' }}
          borderRadius={'8px'}
          bg="bg"
        >
          <CopyAddressButton address={address} />
        </MenuItem>
        <Box
          onClick={() => {
            openDelegate();
          }}
        >
          <MenuItem
            padding="2"
            backgroundColor="white"
            _hover={{ bg: 'white' }}
            borderRadius={'8px'}
            bg="bg"
          >
            <Flex
              bg="bg"
              borderRadius={'8px'}
              width={'100%'}
              height={'38px'}
              alignItems={'center'}
              paddingX={'10px'}
              paddingY={'10px'}
            >
              <Image
                src="/Wallet_Delegate.svg"
                alt="Disconnect"
                width={'22px'}
                height={'22px'}
              ></Image>
              <Text
                color="darkPurple"
                fontWeight="medium"
                fontSize={14}
                marginLeft={'6px'}
                fontFamily="DM Sans"
              >
                Delegate
              </Text>
              <Spacer />
            </Flex>
          </MenuItem>
        </Box>
        <MenuItem
          backgroundColor="white"
          padding="2"
          _hover={{ bg: 'white' }}
          borderRadius={'8px'}
          onClick={handleDisconnect}
          bg="bg"
        >
          <Flex
            borderRadius={'8px'}
            bg="bg"
            width={'100%'}
            height={'38px'}
            alignItems={'center'}
            paddingX={'10px'}
            paddingY={'10px'}
          >
            <Image
              src="/Disconnect_Wallet.svg"
              alt="Disconnect"
              width={'24px'}
              height={'24px'}
            ></Image>
            <Text
              color="darkPurple"
              fontWeight="medium"
              fontSize={14}
              marginLeft={'6px'}
              fontFamily="DM Sans"
            >
              Disconnect
            </Text>
            <Spacer />
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
