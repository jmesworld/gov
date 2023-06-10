import {
  Box,
  CircularProgress,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import { useCallback, useEffect, useState } from "react";

import AddJMESCard from "./components/AddJMESCard";
import AddTokensCard from "./components/AddTokensCard";
import ChooseUsernameCard from "./components/ChooseUsernameCard";
import ConnectWalletCard from "./components/ConnectWalletCard";

import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../config/defaults";
import { checkJMESInKeplr } from "../../actions/keplr";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import InstallKeplrCard from "./components/InstallKeplrCard";
import OnboardingProgressIndicator from "./components/OnboardingProgressIndicator";

interface OnboardingModalProps {
  isOpen: any;
  setOpen: any;
}

export default function OnboardingModal() {
  const {
    address,
    status,
    getCosmWasmClient,
    connect,
    disconnect,
    walletRepo,
  } = useChain(chainName);
  const [radioGroup, setRadioGroup] = useState(new Array());
  const [currentCard, setCurrentCard] = useState(null || String);
  const [isInitializing, setIsInitializing] = useState(true);

  const [identityName, setIdentityName] = useState("");
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );

  useEffect(() => {
    if (address) {
      getCosmWasmClient()
        .then((cosmWasmClient) => {
          if (!cosmWasmClient) {
            return;
          }
          setCosmWasmClient(cosmWasmClient);
        })
        .catch((error) => console.log(error));
    }
  }, [address, getCosmWasmClient]);

  useEffect(() => {
    if (status === WalletStatus.Connecting) {
      setIsInitializing(true);
    }
  }, [status]);

  useEffect(() => {
    let cards = new Array();
    checkJMESInKeplr()
      .then((val) => {
        if (!val) {
          cards.push("add-jmes-card");
        }
        if (status !== WalletStatus.Connected) {
          cards.push("connect-wallet-card");
        }
        cards.push("add-tokens-card");
        cards.push("choose-username-card");
      })
      .then(() => {
        setRadioGroup([...cards]);
        setCurrentCard(cards[0]);
        setIsInitializing(false);
      });
  }, [status]);

  const handleClose = () => {
    setCurrentCard(radioGroup[0]); // should disconnect wallet
    disconnect();
  };

  return (
    <Modal
      isOpen={!!currentCard}
      onClose={handleClose}
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
                {!isInitializing ? (
                  <OnboardingComponent
                    onClose={handleClose}
                    currentCard={currentCard}
                    radioGroup={radioGroup}
                    setCurrentCard={setCurrentCard}
                    setIsInitializing={setIsInitializing}
                    identityName={identityName}
                    setIdentityName={setIdentityName}
                  />
                ) : (
                  <CircularProgress />
                )}
              </span>
            </Box>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}

export const OnboardingComponent = ({
  currentCard,
  radioGroup,
  setCurrentCard,
  setIsInitializing,
  identityName,
  setIdentityName,
  onClose,
}: {
  onClose: () => void;
  currentCard: String;
  radioGroup: Array<String>;
  setCurrentCard: Function;
  setIsInitializing: Function;
  identityName: String;
  setIdentityName: Function;
}) => {
  switch (currentCard) {
    case "install-keplr-card":
      return (
        <InstallKeplrCard
          radioGroup={radioGroup}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
          setIsInitalizing={setIsInitializing}
          onClose={onClose}
        />
      );

    case "add-jmes-card":
      return (
        <AddJMESCard
          radioGroup={radioGroup}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
          setIsInitalizing={setIsInitializing}
        />
      );
    case "connect-wallet-card":
      return (
        <ConnectWalletCard
          radioGroup={radioGroup}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
          setIsInitalizing={setIsInitializing}
        />
      );
    case "add-tokens-card":
      return (
        <AddTokensCard
          radioGroup={radioGroup}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
          setIsInitalizing={setIsInitializing}
          setIdentityName={setIdentityName}
        />
      );
    case "choose-username-card":
      return (
        <ChooseUsernameCard
          radioGroup={radioGroup}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
          setIsInitalizing={setIsInitializing}
          identityName={identityName}
        />
      );
    default:
      return (
        <>
          <CircularProgress />|
        </>
      );
  }
};
