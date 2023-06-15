import { MouseEventHandler, ReactNode } from "react";
import { IconType } from "react-icons";

export interface ChooseChainInfo {
  chainName: string;
  chainRoute?: string;
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}

export enum WalletStatus {
  Init = "Init",
  Connecting = "Connecting",
  Connected = "Connected",
  ConnectFailed = "ConnectFailed",
  Disconnected = "Disconnected",
  NotInit = "NotInit",
  Loading = "Loading",
  Loaded = "Loaded",
  NotExist = "NotExist",
  Rejected = "Rejected",
}
export interface DAOItemProps {
  name: string | null | undefined;
  address: string;
  // TODO: Add more fields
}
export interface NavBarProps {
  status: WalletStatus;
  address: any;
  identityName: string;
  isGovProposalSelected: boolean;
  isCreateDaoSelected: boolean;
  selectedDao: string;
  selectedDaoName: string;
}
export interface DAOCosigner {
  name: string;
  weight: number;
  id: number;
}

export interface ConnectWalletType {
  buttonText?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: IconType;
  onClickConnectBtn?: MouseEventHandler<HTMLButtonElement>;
}
export interface ConnectedWalletType {
  walletIcon?: string;
  username?: string;
  identityName?: string;
  identityBalance?: string | number;
  buttonText?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  setConnectButtonClicked?: any;
  onClickConnectBtn?: MouseEventHandler<HTMLButtonElement>;
}
export interface ConnectedUserCardType {
  walletIcon?: string;
  address?: string;
  username?: string;
  identityName?: string;
  icon?: ReactNode;
  balance?: string | number;
}

export interface FeatureProps {
  title: string;
  text: string;
  href: string;
}

export interface ChainCardProps {
  prettyName: string;
  icon?: string;
}

export type CopyAddressType = {
  address?: string;
  walletIcon?: string;
  isLoading?: boolean;
  maxDisplayLength?: number;
  isRound?: boolean;
  size?: string;
};
