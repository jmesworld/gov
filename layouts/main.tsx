import { ReactElement } from 'react';
import {
  Box,
  Container,
  Flex,
  Spacer,
  useBreakpointValue,
} from '@chakra-ui/react';
import MobileViewDisabled from '../features/Onboarding/components/MobileViewDisabled';
import Head from 'next/head';
import { Header, NavBar } from '../features';
import { useChain } from '@cosmos-kit/react';
import { chainName } from '../config/defaults';
import { useAppState } from '../contexts/AppStateContext';
import { useIdentityContext } from '../contexts/IdentityContext';

export const Layout = ({ children }: { children: ReactElement }) => {
  const isMobileView = useBreakpointValue({ base: true, md: false });
  const { address, status } = useChain(chainName);
  const { getIdentityName } = useIdentityContext();

  const { selectedDao, setSelectedDao, selectedDaoName, setSelectedDaoName } =
    useAppState();

  if (isMobileView) {
    return <MobileViewDisabled />;
  }

  return (
    <>
      <>
        <Container maxW="100%" padding={0} backgroundColor="bg">
          <Head>
            <title>JMES Governance</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Flex padding={0} width={'100vw'} height={'100vh'}>
            <NavBar
              status={status}
              address={address}
              identityName={getIdentityName()}
              setSelectedDao={val => {
                setSelectedDao(val);
              }}
              setSelectedDaoName={setSelectedDaoName}
              selectedDao={selectedDao}
              selectedDaoName={selectedDaoName}
            />
            <Box
              width={'100%'}
              height={'100%'}
              paddingLeft={'54px'}
              paddingTop={'25px'}
              paddingBottom={'25px'}
              paddingRight={'54px'}
              overflowY="scroll"
              position={'relative'}
            >
              <Flex width={'100%'} top={0} position="sticky" bg="bg">
                <Spacer />
                <Header />
              </Flex>
              <Box as="main" display={'block'} overflowY={'auto'}>
                {children}
              </Box>
            </Box>
          </Flex>
        </Container>
      </>
    </>
  );
};
