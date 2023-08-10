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
  useToken,
} from '@chakra-ui/react';

import { ConnectedWalletType } from '../../types';
import { useIdentityContext } from '../../../contexts/IdentityContext';
import React, { RefObject, useState } from 'react';
import { useDelegateContext } from '../../../contexts/DelegateContext';
import { useLeaveConfirmContext } from '../../../hooks/useLeaveConfirm';
import { PromiseModal } from '../../components/genial/PromiseModal';
import { useBalanceContext } from '../../../contexts/balanceContext';
import { useClipboardTimeout } from '../../../hooks/useClipboard';
import { CopiedText } from '../../components/genial/CopiedText';
import CopyIcon from '../../../assets/icons/copy.svg';
import CheckIcon from '../../../assets/icons/CheckFilled.svg';

export const ConnectedWalletButton = ({
  identityName,
  isLoading,
  isDisabled,
}: ConnectedWalletType) => {
  const { check, preventNavigatingAway } = useLeaveConfirmContext();
  const { address, disconnect } = useIdentityContext();
  const [mouseEnter, setOnMouseEnter] = useState(false);
  const [copied, copyToClipbaord] = useClipboardTimeout();
  const { openDelegate } = useDelegateContext();
  const { isOpen, onToggle, buttonRef } = useMenu({
    defaultIsOpen: false,
  });
  const [green, purple] = useToken('colors', ['darkGreen', 'purple']);
  const handleDisconnect = () => {
    if (preventNavigatingAway && check) {
      PromiseModal({
        title: 'Are you sure you want to disconnect your Wallet?',
        description: 'All data will be lost.',
      }).then(() => {
        disconnect?.();
      });
      return;
    }
    disconnect?.();
  };
  const { formattedBalance, formattedWithSuffix } = useBalanceContext();

  return (
    <Menu isOpen={isOpen}>
      <Flex
        id="id"
        ref={buttonRef as unknown as RefObject<HTMLDivElement>}
        onClick={e => {
          onToggle();
          e.preventDefault();
        }}
        onMouseEnter={() => {
          setOnMouseEnter(true);
        }}
        onMouseLeave={() => {
          setOnMouseEnter(false);
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
          <Tooltip hasArrow label={address}>
            <Text
              color="#7453FD"
              fontWeight="bold"
              fontSize={12}
              marginLeft={'5.3px'}
              fontFamily="DM Sans"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              maxW={'120px'}
            >
              {identityName ? identityName : address}
            </Text>
          </Tooltip>

          {mouseEnter || copied ? (
            <Tooltip
              isOpen={copied || undefined}
              label={copied ? <CopiedText text="Copied!" /> : 'Copy  address'}
              hasArrow
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              placement="top"
            >
              <Flex>
                {!copied && (
                  <CopyIcon
                    width={'16px'}
                    height={'16px'}
                    color={purple}
                    onClick={(e: React.MouseEvent) => {
                      copyToClipbaord(address ?? '');
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    style={{
                      marginLeft: '4px',
                    }}
                  />
                )}
                {copied && (
                  <CheckIcon
                    width={'14px'}
                    height={'14px'}
                    color={green}
                    style={{
                      marginLeft: '4px',
                    }}
                  />
                )}
              </Flex>
            </Tooltip>
          ) : (
            <Flex width={'16px'} height={'16px'} marginLeft="4px" />
          )}
          <Spacer marginLeft={'13px'} />
          <Tooltip
            label={`JMES ${formattedBalance?.jmes} `}
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
              >
                {formattedWithSuffix?.jmes}{' '}
              </Text>
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
            label={`bJMES ${formattedBalance?.bJmes} `}
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
              >
                {formattedWithSuffix?.bJmes}
              </Text>
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
        <Box
          onClick={() => {
            openDelegate();
          }}
        >
          <MenuItem
            backgroundColor="white"
            _hover={{ bg: 'white' }}
            borderRadius={'8px'}
            bg="bg"
            paddingX="4px"
            paddingTop="5px"
            paddingBottom="0"
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
          paddingX="4px"
          paddingTop="3px"
          paddingBottom="5px"
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
