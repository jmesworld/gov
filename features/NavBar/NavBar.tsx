import { VStack, Box, Flex, Text, Spacer, Image } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { WalletStatus } from '@cosmos-kit/core';
import dynamic from 'next/dynamic';
import { NavBarItem } from './NavBarItem';
import { NavBarButton } from './NavBarButton';
import { Link } from '../components/genial/Link';
import { useRouter } from 'next/router';
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
  address,
  status,
  identityName,

  setSelectedDao,
  setSelectedDaoName,
}: NavBarProps) => {
  const router = useRouter();
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
        width={'200px'}
        height={'42px'}
        paddingLeft={'26px'}
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
      <Link.withStatus
        href="/"
        activePattern={[/^\/$/, /^\/proposals\/\[[^\]]+\]$/]}
      >
        {({ isActive }) => (
          <NavBarItem
            text="Proposals"
            isSelected={isActive}
            onClick={() => {
              setSelectedDao('');
              setSelectedDaoName('');
            }}
          />
        )}
      </Link.withStatus>
      <Box height={'27px'} />
      <Flex
        width={'200px'}
        height={'42px'}
        paddingLeft={'26px'}
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
      {typeof window !== 'undefined' &&
      address !== 'undefined' &&
      !(localStorage.getItem('myDaosData') as string)?.includes('undefined') ? (
        <MyDaoList />
      ) : (
        <></>
      )}
      <Link href="/dao/create">
        <NavBarButton
          width="180px"
          height="48px"
          text={'New DAO'}
          disabled={status !== WalletStatus.Connected || !identityName}
        />
      </Link>
      <Spacer />
      <NavBarButton
        width="180px"
        height="48px"
        text="DAO Proposal"
        // disabled={status !== WalletStatus.Connected}
        disabled={true} // TODO: remove later
      />
      <Link href="/proposals/create">
        <NavBarButton
          width="180px"
          height="48px"
          text="GOV Proposal"
          disabled={
            ['/', '/proposals/[id]', '/dao/create'].includes(router.route) ||
            status !== WalletStatus.Connected ||
            !identityName
          }
        />
      </Link>
      <Flex height={'10px'} />
    </VStack>
  );
};

export default NavBar;
