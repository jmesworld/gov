import {
  Box,
  CircularProgress,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

import AddTokensCard from "./components/AddTokensCard";
import ChooseUsernameCard from "./components/ChooseUsernameCard";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../config/defaults";

import { useAccountBalance } from "../../hooks/useAccountBalance";
import { useCosmWasmClient } from "../../contexts/ClientContext";
import { useClientIdentity } from "../../hooks/useClientIdentity";

export default function OnboardingModal() {
  const balance = useAccountBalance(chainName);
  const { disconnect } = useChain(chainName);
  const { identityName } = useCosmWasmClient();

  const { identityOwnerQuery } = useClientIdentity();
  const identityNameStatus = identityOwnerQuery.status;

  return (
    <>
      <Modal
        isOpen={
          identityOwnerQuery.isSuccess || identityNameStatus === "loading"
            ? false
            : true
        }
        onClose={() => {
          disconnect();
        }}
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay>
          <ModalContent
            maxW="500px"
            maxH="675px"
            alignItems={"center"}
            borderRadius={"12px"}
          >
            <ModalBody padding={0}>
              <Box
                backgroundColor={"#704FF7"}
                width={"500px"}
                height={"500px"}
                borderRadius={"12px"}
              >
                <span
                  style={{
                    zIndex: 99999,
                    position: "fixed",
                  }}
                >
                  {balance.data?.unstaked === 0 ? (
                    <AddTokensCard />
                  ) : balance.data?.unstaked && !identityName ? (
                    <ChooseUsernameCard
                      isOpen={true}
                      identityName={identityName}
                    />
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
