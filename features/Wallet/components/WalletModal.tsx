import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../../config/defaults";
import { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import AddTokensCard from "../../Onboarding/components/AddTokensCard";
import ChooseUsernameCard from "../../Onboarding/components/ChooseUsernameCard";
import { useAccountBalance } from "../../../hooks/useAccountBalance";
import { useClientIdentity } from "../../../hooks/useClientIdentity";

export const WalletModal = () => {
  const { address, closeView, openView, disconnect } = useChain(chainName);
  const { identityName, identityOwnerQuery } = useClientIdentity();
  const balance = useAccountBalance(address as string);

  const renderCard = () => {
    if (identityOwnerQuery?.status !== "success") {
      // TODO: we could show a loading indicator/animation here instead
      return <></>;
    }

    if (balance.data?.unstaked === 0 ) {
      return (
        <CSSTransition
          classNames="card-animation"
          timeout={300}
          key="add-tokens-card"
        >
          <AddTokensCard />
        </CSSTransition>
      );
    } else if (!identityName) {
      return (
        <CSSTransition
          classNames="card-animation"
          timeout={300}
          key="choose-username-card"
        >
          <ChooseUsernameCard identityName={identityName as string} />
        </CSSTransition>
      );
    } else {
      closeView();
      return <></>;
    }
  };

  return <TransitionGroup>{renderCard()}</TransitionGroup>;
};
