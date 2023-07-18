import { ReactElement } from 'react';
import { Box, Container, Flex } from '@chakra-ui/react';
import MobileViewDisabled from '../features/Onboarding/components/MobileViewDisabled';
import { Header, NavBar } from '../features';
import { useChain } from '@cosmos-kit/react';
import { chainName } from '../config/defaults';
import { useAppState } from '../contexts/AppStateContext';
import { useIdentityContext } from '../contexts/IdentityContext';
import { ErrorBoundary } from '../error/errorBondary';
import { useIsViewportMobile } from '../hooks/useIsMobile';

export const Layout = ({ children }: { children: ReactElement }) => {
  const [isMobileView] = useIsViewportMobile();
  const { address, status } = useChain(chainName);
  const { getIdentityName } = useIdentityContext();

  const { selectedDao, setSelectedDao, selectedDaoName, setSelectedDaoName } =
    useAppState();
  if (isMobileView) {
    return <MobileViewDisabled />;
  }

  return (
    <Container maxW="100%" padding={0} backgroundColor="bg">
      <Flex padding={0} width={'100vw'} height={'100vh'}>
        <ErrorBoundary>
          <NavBar
            status={status}
            address={address as string}
            identityName={getIdentityName()}
            setSelectedDao={val => {
              setSelectedDao(val);
            }}
            setSelectedDaoName={setSelectedDaoName}
            selectedDao={selectedDao}
            selectedDaoName={selectedDaoName}
          />
        </ErrorBoundary>
        <Box
          width={'100%'}
          height={'100%'}
          paddingLeft={'50px'}
          paddingBottom={'25px'}
          paddingRight={'50px'}
          overflowY="scroll"
          position={'relative'}
        >
          <Flex
            zIndex="999"
            paddingTop={'25px'}
            width={'100%'}
            top={0}
            position="sticky"
            bg="bg"
          >
            <Header />
          </Flex>
          <Box
            as="main"
            display={'block'}
            w="full"
            height="90%"
            overflowY="auto"
            pos="relative"
            overflow={'visible'}
          >
            {children}
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};
