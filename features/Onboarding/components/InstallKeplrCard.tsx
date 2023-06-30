import { ArrowBackIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Spacer,
  Image,
  Text,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  CHROME_EXTENSION_STORE,
  FIREFOX_ADDON_STORE,
  BRAVE_EXTENSION_STORE,
} from '../../../config';

interface CardProps {
  onClose: () => void | undefined;
  radioGroup: Array<String>;
  currentCard: String;
  setCurrentCard: Function;
  setIsInitalizing: Function;
}

const InstallKeplrCard = ({
  onClose,
  radioGroup,
  currentCard,
  setCurrentCard,
  setIsInitalizing,
}: {
  onClose: () => void | undefined;
  radioGroup: Array<String>;
  currentCard: String;
  setCurrentCard: Function;
  setIsInitalizing: Function;
}) => {
  const handleBrowserClick = (storeUrl: string) => {
    window.location.href = storeUrl;
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <Box
      width={'500px'}
      height={'590px'}
      alignItems={'center'}
      marginTop={'-90px'}
    >
      <Flex>
        <Flex width={'100%'} justifyContent={'space-between'}>
          <IconButton
            aria-label=""
            background={'transparent'}
            color={'transparent'}
            icon={<ArrowBackIcon width={'24px'} height={'24px'} />}
            marginTop={'100px'}
            marginLeft={'8px'}
            _hover={{ backgroundColor: 'transparent' }}
          />
          <Image
            src="/JMES_Add.svg"
            alt="icon"
            width={'255px'}
            height={'311px'}
            justifySelf={'center'}
          />
          <IconButton
            aria-label=""
            background={'transparent'}
            color={'white'}
            icon={<CloseIcon height={'24px'} />}
            marginTop={'100px'}
            marginRight={'8px'}
            _hover={{ backgroundColor: 'transparent' }}
            onClick={() => handleCloseModal()}
          />
        </Flex>
        <Spacer />
      </Flex>
      <Flex>
        <Spacer />
        <Text
          color={'white'}
          fontFamily="DM Sans"
          fontWeight={'bold'}
          fontSize={28}
          py={'6px'}
        >
          Please install the Keplr Extension to connect your JMES wallet.
        </Text>
        <Spacer />
      </Flex>
      <Flex>
        <Spacer />
        <Text
          color={'white'}
          fontFamily="DM Sans"
          fontWeight={'normal'}
          fontSize={16}
        >
          After install, please reload the page and press the connect wallet
          button to initiate the onboarding process.
        </Text>
        <Spacer />
      </Flex>
      <Flex>
        <Spacer />
        <Text
          color={'white'}
          fontFamily="DM Sans"
          fontWeight={'normal'}
          fontSize={16}
        >
          This is a 4 step process which is nullified if you refresh the page.
        </Text>
        <Spacer />
      </Flex>

      <Flex py={'25px'}>
        <Spacer />
        <Button
          onClick={() => handleBrowserClick(CHROME_EXTENSION_STORE)}
          backgroundColor={'green'}
          borderRadius={90}
          alignContent="end"
          width={'200px'}
          height={'48px'}
          _hover={{ bg: 'green' }}
          _active={{ bg: 'green' }}
          variant={'outline'}
          borderWidth={'1px'}
          borderColor={'rgba(0,0,0,0.1)'}
        >
          <Text
            color="midnight"
            fontFamily={'DM Sans'}
            fontWeight="medium"
            fontSize={14}
          >
            Install Keplr from Chrome Store
          </Text>
        </Button>
        <Spacer />
        <Button
          onClick={() => handleBrowserClick(FIREFOX_ADDON_STORE)}
          backgroundColor={'green'}
          borderRadius={90}
          alignContent="end"
          width={'200px'}
          height={'48px'}
          _hover={{ bg: 'green' }}
          _active={{ bg: 'green' }}
          variant={'outline'}
          borderWidth={'1px'}
          borderColor={'rgba(0,0,0,0.1)'}
        >
          <Text
            color="midnight"
            fontFamily={'DM Sans'}
            fontWeight="medium"
            fontSize={14}
          >
            Install Keplr from Firefox Store
          </Text>
        </Button>
        <Spacer />
        <Button
          onClick={() => handleBrowserClick(BRAVE_EXTENSION_STORE)}
          backgroundColor={'green'}
          borderRadius={90}
          alignContent="end"
          width={'200px'}
          height={'48px'}
          _hover={{ bg: 'green' }}
          _active={{ bg: 'green' }}
          variant={'outline'}
          borderWidth={'1px'}
          borderColor={'rgba(0,0,0,0.1)'}
        >
          <Text
            color="midnight"
            fontFamily={'DM Sans'}
            fontWeight="medium"
            fontSize={14}
          >
            Install Keplr from the Brave Store
          </Text>
        </Button>
      </Flex>
      <Spacer />
    </Box>
  );
};

export default InstallKeplrCard;
