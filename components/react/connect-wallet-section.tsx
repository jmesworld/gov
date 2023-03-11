import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { addJMEStoKeplr, checkJMESInKeplr } from "../../actions/keplr";
import { BjmesTokenQueryClient } from "../../client/BjmesToken.client";
import { useBjmesTokenBalanceQuery } from "../../client/BjmesToken.react-query";
import { IdentityserviceQueryClient } from "../../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../../client/Identityservice.react-query";
import { chainName } from "../../config/defaults";
import { ConnectButton } from "./connect-wallet-button";
import { ConnectedWalletButton } from "./connected-wallet-button";
import { OnboardingModal } from "./onboarding-modal";

export function ConnectWalletSection({
  identityName,
  identityBalance,
  isConnectButtonClicked,
  setConnectButtonClicked,
}: {
  identityName: string;
  identityBalance: string;
  isConnectButtonClicked: boolean;
  setConnectButtonClicked: Function;
}) {
  const { address, status, connect, getCosmWasmClient } = useChain(chainName);
  const [isJMESInKeplr, setJMESInKeplr] = useState(false);

  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  function connectWallet() {
    setConnectButtonClicked(true);
  }

  return (
    <>
      {status === WalletStatus.Connected ? (
        <ConnectedWalletButton
          identityName={identityName}
          identityBalance={identityBalance}
        />
      ) : (
        <ConnectButton connectWallet={connectWallet} />
      )}
    </>
  );
}
