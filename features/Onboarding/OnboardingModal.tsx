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

import { useIdentityContext } from '../../contexts/IdentityContext';
import { useBalanceContext } from '../../contexts/balanceContext';
import { useMemo } from 'react';

export default function OnboardingModal() {
  const { loadingIdentity, getIdentityName, disconnect, address } =
    useIdentityContext();

  const { balance } = useBalanceContext();

  const isOpen = useMemo(() => {
    if (loadingIdentity || !address || !balance) {
      return false;
    }
    if (!getIdentityName()) {
      return true;
    }
    if (!balance?.unstaked) {
      return true;
    }

    return false;
  }, [address, balance, getIdentityName, loadingIdentity]);

   if (!isOpen) return null;
  return (
    <>
      <Modal
        isOpen={isOpen}
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
                  {balance?.unstaked === 0 ? (
                    <AddTokensCard />
                  ) : balance?.unstaked &&
                    !getIdentityName() &&
                    !loadingIdentity ? (
                    <ChooseUsernameCard
                      identityName={getIdentityName() ?? ''}
                    />
                  ) : balance && getIdentityName() ? null : (
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
