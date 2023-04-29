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
import { useEffect, useState } from "react";
import { setCommentRange } from "typescript";
import { AddJMESCard } from "./add-jmes-card";
import { AddTokensCard } from "./add-tokens-card";
import { ChooseUsernameCard } from "./choose-username-card";
import { ConnectWalletCard } from "./connect-wallet-card";
import { OnboardingProgressIndicator } from "./onboarding-progress-indicator";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../config/defaults";
import { checkJMESInKeplr } from "../../actions/keplr";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { IdentityserviceQueryClient } from "../../client/Identityservice.client";
import { BjmesTokenQueryClient } from "../../client/BjmesToken.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../../client/Identityservice.react-query";
import { useBjmesTokenBalanceQuery } from "../../client/BjmesToken.react-query";

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const BJMES_TOKEN_CONTRACT = process.env
  .NEXT_PUBLIC_BJMES_TOKEN_CONTRACT as string;

export default function OnboardingModal() {
  const { address, status, getCosmWasmClient } = useChain(chainName);

  const [radioGroup, setRadioGroup] = useState(new Array());
  const [currentCard, setCurrentCard] = useState(null || String);
  const [isInitializing, setIsInitializing] = useState(true);
  const [identityBalance, setIdentityBalance] = useState("");
  const [identityName, setIdentityName] = useState("");

  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  useEffect(() => {
    getCosmWasmClient()
      .then((cosmWasmClient) => {
        if (!cosmWasmClient) {
          return;
        }
        setCosmWasmClient(cosmWasmClient);
      })
      .catch((error) => console.log(error));
  }, [getCosmWasmClient]);

  const identityserviceQueryClient: IdentityserviceQueryClient =
    new IdentityserviceQueryClient(
      cosmWasmClient as CosmWasmClient,
      IDENTITY_SERVICE_CONTRACT
    );
  const bjmesTokenQueryClient: BjmesTokenQueryClient =
    new BjmesTokenQueryClient(
      cosmWasmClient as CosmWasmClient,
      BJMES_TOKEN_CONTRACT
    );

  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceQueryClient,
    args: { owner: address ? address : "" },
    options: {
      refetchInterval: 10,
      onSuccess: (data) => {
        setIdentityName(data?.identity?.name as string);
      },
    },
  });

  const identityOwnerBalanceQuery = useBjmesTokenBalanceQuery({
    client: bjmesTokenQueryClient,
    args: { address: address as string },
    options: {
      //  refetchInterval: 10,
      onSuccess: (data) => {
        setIdentityBalance(data?.balance as string);
      },
    },
  });

  useEffect(() => {
    if (status === WalletStatus.Connecting) {
      setIsInitializing(true)
    }
  })

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
  }, [isInitializing === true]);

  const handleClose = () => {
    setCurrentCard(radioGroup[0]);
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

const OnboardingComponent = ({
  currentCard,
  radioGroup,
  setCurrentCard,
  setIsInitializing,
  identityName,
  setIdentityName,
}: {
  currentCard: String;
  radioGroup: Array<String>;
  setCurrentCard: Function;
  setIsInitializing: Function;
  identityName: String;
  setIdentityName: Function;
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
      return <></>;
  }
};
