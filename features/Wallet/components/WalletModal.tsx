import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../../config/defaults";
import { useState } from "react";
import AddTokensCard from "../../Onboarding/components/AddTokensCard";
import ChooseUsernameCard from "../../Onboarding/components/ChooseUsernameCard";
import { useAccountBalance } from "../../../hooks/useAccountBalance";

import { useClientIdentity } from "../../../hooks/useClientIdentity";

//for implementing custom modals see: https://docs.cosmoskit.com/provider/chain-provider#customize-modal-with-walletmodal

export const WalletModal = () => {
  const { address, disconnect } = useChain(chainName);
  const { identityName, identityOwnerQuery } = useClientIdentity();
  const balance = useAccountBalance(address as string);

  const renderCard = () => {
    if (!identityName && balance.data?.unstaked === 0) {
      return <AddTokensCard isOpen={true} />;
    } else if (!identityName && balance.data?.unstaked !== 0) {
      return <ChooseUsernameCard identityName={identityName} isOpen={true} />;
    } else {
      return null;
    }
  };
  return <>{renderCard()}</>;
};
