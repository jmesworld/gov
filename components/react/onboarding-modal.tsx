import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import { useEffect, useState } from "react";
import { setCommentRange } from "typescript";
import { AddJMESCard } from "./add-jmes-card";
import { AddTokensCard } from "./add-tokens-card";
import { ChooseUsernameCard } from "./choose-username-card";
import { ConnectWalletCard } from "./connect-wallet-card";
import { OnboardingProgressIndicator } from "./onboarding-progress-indicator";

export const OnboardingModal = ({
  walletStatus,
  isJMESInKeplr,
  identityBalance,
  identityName,
  isConnectButtonClicked,
  setConnectButtonClicked,
}: {
  walletStatus: WalletStatus;
  isJMESInKeplr: boolean;
  identityBalance: string;
  identityName: string;
  isConnectButtonClicked: boolean;
  setConnectButtonClicked: Function;
}) => {
  const isOpen =
    (isConnectButtonClicked || walletStatus === WalletStatus.Connecting) &&
    (!isJMESInKeplr ||
    identityName?.length < 1 ||
    parseInt(identityBalance) === 0
      ? true
      : false);

  const [radioGroup, setRadioGroup] = useState(new Array());
  const [currentCard, setCurrentCard] = useState(null || String);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let cards = new Array(4);
    if (!isJMESInKeplr) {
      cards[0] = "add-jmes-card";
      setCurrentCard("add-jmes-card");
    }
    if (walletStatus !== WalletStatus.Connected) {
      cards[1] = "connect-wallet-card";
      if (!!isJMESInKeplr) {
        setCurrentCard("connect-wallet-card");
      }
    }
    if (parseInt(identityBalance) === 0 || !parseInt(identityBalance)) {
      cards[2] = "add-tokens-card";
      if (walletStatus === WalletStatus.Connected) {
        setCurrentCard("add-tokens-card");
      }
    }
    if (identityName?.length < 1) {
      cards[3] = "choose-username-card";
      if (parseInt(identityBalance) > 0 || !!parseInt(identityBalance)) {
        setCurrentCard("choose-username-card");
      }
    }
    const values = cards.filter((card) => !!card);
    setRadioGroup(values);
  }, [isInitializing]);

  const handleClose = () => {
    setConnectButtonClicked(false);
    setCurrentCard(radioGroup[0]);
  };

  return (
    <Modal
      isOpen={isOpen && !!currentCard}
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
                <OnboardingComponent
                  currentCard={currentCard}
                  radioGroup={radioGroup}
                  setCurrentCard={setCurrentCard}
                  setIsInitializing={setIsInitializing}
                  identityName={identityName}
                />
              </span>
            </Box>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

const OnboardingComponent = ({
  currentCard,
  radioGroup,
  setCurrentCard,
  setIsInitializing,
  identityName,
}: {
  currentCard: String;
  radioGroup: Array<String>;
  setCurrentCard: Function;
  setIsInitializing: Function;
  identityName: String;
}) => {
  switch (currentCard) {
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
      return <></>;
  }
};
