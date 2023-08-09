import {
  VStack,
  Box,
  Flex,
  Text,
  Spacer,
  Image,
  Skeleton,
  Tooltip,
  Divider,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { WalletStatus } from '@cosmos-kit/core';
import dynamic from 'next/dynamic';
import { NavBarItem } from './NavBarItem';
import { NavBarButton } from './NavBarButton';
import { Link } from '../components/genial/Link';
import { useRouter } from 'next/router';
import { useDAOContext } from '../../contexts/DAOContext';
const MyDaoList = dynamic(() => import('../Dao/MyDaoList'));

interface NavBarProps {
  status: WalletStatus;
  address: string;
  identityName: string | undefined;
  setSelectedDao: Dispatch<SetStateAction<string>>;
  setSelectedDaoName: Dispatch<SetStateAction<string>>;
  selectedDao: string;
  selectedDaoName: string;
}

const NavBar = ({
  status,
  identityName,

  setSelectedDao,
  setSelectedDaoName,
}: NavBarProps) => {
  const router = useRouter();
  const { afterCreate } = useDAOContext();
  return (
    <VStack
      width={'200px'}
      height={'100%'}
      backgroundColor={'#7453FD'}
      paddingTop={'30px'}
      paddingLeft={'0px'}
      overflowY="scroll"
      alignItems="start"
    >
      <Link href="/">
        <Image
          cursor={'pointer'}
          src="/Logo.svg"
          alt="JMES"
          width={'83.37px'}
          height={'24px'}
          ml={'26px'}
          mb={34}
        />
      </Link>
      <Flex
        width="full"
        height={'42px'}
        paddingLeft={'25px'}
        backgroundColor={'#7453FD'}
      >
        <Text
          color="#A1F0C4"
          fontFamily={'DM Sans'}
          fontWeight="bold"
          fontSize={12}
          alignSelf="center"
        >
          GOVERNANCE
        </Text>
      </Flex>
      <Flex flexDir="column" w="full">
        <Tooltip
          openDelay={500}
          w="full"
          shouldWrapChildren
          hasArrow
          label="Active proposals"
        >
          <Link.withStatus
            href="/"
            matchFunc={route => {
              if (router.route === '/') {
                return true;
              }
              if (router.route !== '/proposals/[id]') {
                return false;
              }

              const query = route.query.tab;
              if (query === 'funded') {
                return false;
              }
              if (query === 'core-slots') {
                return false;
              }
              if (query === 'archived') {
                return false;
              }
              return true;
            }}
          >
            {({ isActive }) => (
              <NavBarItem
                text="Active"
                isSelected={isActive}
                onClick={() => {
                  setSelectedDao('');
                  setSelectedDaoName('');
                }}
              />
            )}
          </Link.withStatus>
        </Tooltip>
        <Tooltip
          openDelay={500}
          w="full"
          shouldWrapChildren
          hasArrow
          label="Funded proposals"
        >
          <Link.withStatus
            matchFunc={route => {
              if (router.route === '/funded') {
                return true;
              }
              if (router.route !== '/proposals/[id]') {
                return false;
              }

              const query = route.query.tab;
              if (query !== 'funded') {
                return false;
              }
              return true;
            }}
            href="/funded"
          >
            {({ isActive }) => (
              <NavBarItem
                text="Funded"
                isSelected={isActive}
                onClick={() => {
                  setSelectedDao('');
                  setSelectedDaoName('');
                }}
              />
            )}
          </Link.withStatus>
        </Tooltip>
        <Tooltip
          openDelay={500}
          w="full"
          shouldWrapChildren
          hasArrow
          label="Core Slot proposals"
        >
          <Link.withStatus
            matchFunc={route => {
              if (router.route === '/core-slots') {
                return true;
              }
              if (router.route !== '/proposals/[id]') {
                return false;
              }

              const query = route.query.tab;
              if (query !== 'core-slots') {
                return false;
              }
              return true;
            }}
            href="/core-slots"
          >
            {({ isActive }) => (
              <NavBarItem
                text="Core Slots"
                isSelected={isActive}
                onClick={() => {
                  setSelectedDao('');
                  setSelectedDaoName('');
                }}
              />
            )}
          </Link.withStatus>
        </Tooltip>
        <Divider my="2" />
        <Tooltip
          openDelay={500}
          w="full"
          shouldWrapChildren
          hasArrow
          label="Archvied proposals"
        >
          <Link.withStatus
            matchFunc={route => {
              if (router.route === '/archived') {
                return true;
              }
              if (router.route !== '/proposals/[id]') {
                return false;
              }

              const query = route.query.tab;
              if (query !== 'archived') {
                return false;
              }
              return true;
            }}
            href="/archived"
          >
            {({ isActive }) => (
              <NavBarItem
                text="Archived"
                isSelected={isActive}
                onClick={() => {
                  setSelectedDao('');
                  setSelectedDaoName('');
                }}
              />
            )}
          </Link.withStatus>
        </Tooltip>
      </Flex>
      <Box height={'27px'} />
      <Flex
        width="full"
        height={'42px'}
        paddingLeft={'25px'}
        backgroundColor={'#7453FD'}
      >
        <Text
          color="#A1F0C4"
          fontFamily={'DM Sans'}
          fontWeight="bold"
          fontSize={12}
          alignSelf="center"
        >
          MY DAOS
        </Text>
      </Flex>
      {afterCreate !== '' && (
        <Box w="full">
          <Skeleton
            startColor="darkPurple"
            endColor="primary.500"
            height="30px"
          />
        </Box>
      )}
      <MyDaoList />

      <Link href="/dao/create">
        <NavBarButton
          width="180px"
          height="48px"
          text={'New DAO'}
          disabled={status !== WalletStatus.Connected || !identityName}
        />
      </Link>
      <Spacer />

      <Flex height={'10px'} />
    </VStack>
  );
};

export default NavBar;
