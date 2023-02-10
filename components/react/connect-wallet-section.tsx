import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../config/defaults";
import { ConnectButton } from "./connect-wallet-button";
import { ConnectedWalletButton } from "./connected-wallet-button";

export function ConnectWalletSection() {
  const { status } = useChain(chainName);
  return status === WalletStatus.Connected ? <ConnectedWalletButton /> : <ConnectButton />;
}
