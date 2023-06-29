import {
  Box,
  CircularProgress,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';

import AddTokensCard from './components/AddTokensCard';
import ChooseUsernameCard from './ChooseUsernameModal';

import { useAccountBalance } from '../../hooks/useAccountBalance';

import { useIdentityContext } from '../../contexts/IdentityContext';

export default function OnboardingModal() {
  const { loadingIdentity, getIdentityName, address, disconnect } =
    useIdentityContext();
  const balance = useAccountBalance(address, 1 * 1000);
  const identityName = getIdentityName();
  return (
    <>
      <Modal
        isOpen={
          !identityName &&
          !loadingIdentity &&
          !!(
            balance.data?.unstaked === 0 ||
            (balance.data?.unstaked && !identityName)
          )
        }
        onClose={() => {
          disconnect?.();
        }}
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay>
          <ModalContent
            maxW="500px"
            maxH="675px"
            alignItems={'center'}
            borderRadius={'12px'}
          >
            <ModalBody padding={0}>
              <Box
                backgroundColor={'#704FF7'}
                width={'500px'}
                height={'500px'}
                borderRadius={'12px'}
              >
                <span
                  style={{
                    zIndex: 99999,
                    position: 'fixed',
                  }}
                >
                  {balance.data?.unstaked === 0 ? (
                    <AddTokensCard />
                  ) : balance.data?.unstaked && !identityName ? (
                    <ChooseUsernameCard identityName={identityName ?? ''} />
                  ) : balance && identityName ? null : (
                    <CircularProgress isIndeterminate color="white" />
                  )}
                </span>
              </Box>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
