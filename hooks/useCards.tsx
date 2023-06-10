import { useTransition } from "react";

import AddJMESCard from "../features/Onboarding/components/AddJMESCard";
import AddTokensCard from "../features/Onboarding/components/AddTokensCard";
import ChooseUsernameCard from "../features/Onboarding/components/ChooseUsernameCard";
import ConnectWalletCard from "../features/Onboarding/components/ConnectWalletCard";
import InstallKeplrCard from "../features/Onboarding/components/InstallKeplrCard";

export const OnboardingComponent = ({
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
    case "install-keplr-card":
      return (
        <InstallKeplrCard
          onClose={() => {}}
          radioGroup={radioGroup}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
          setIsInitalizing={setIsInitializing}
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
      return <></>;
  }
};

const handleOnboarding = async () => {
  //responsible for handling the onboarding modal logic flow and state
};
