import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import { WalletViewProps } from "@cosmos-kit/core";

//for implementing custom modals see: https://docs.cosmoskit.com/provider/chain-provider#customize-modal-with-walletmodal

export const WalletModal = ({ onClose, onReturn, wallet }: WalletViewProps) => {
  const {
    walletInfo: { prettyName, name, mobileDisabled },
    username,
    address,
  } = wallet;

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent justifyContent={"center"} alignSelf={"center"}>
        <ModalHeader>
          {prettyName} Username: {username}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {address}
          <Button
            key={"keplr"}
            colorScheme="blue"
            variant="ghost"
            onClick={undefined}
          >
            {"Disconnect"}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
