import React, { MouseEventHandler, ReactNode, useEffect } from "react";
import { Icon, Stack, Text, useColorModeValue } from "@chakra-ui/react";

import { FiAlertTriangle } from "react-icons/fi";
import { WalletStatus } from "@cosmos-kit/core";
import { addJMEStoKeplr, checkJMESInKeplr } from "../../../actions/keplr";

import { ConnectedWalletButton } from "./ConnectedWalletButton";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { useClientIdentity } from "../../../hooks/useClientIdentity";
// import useClient from "../../../hooks/useClient";
import { useAccountBalance } from "../../../hooks/useAccountBalance";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../../config/defaults";

export const Connected = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  const { identityName, identityOwnerQuery } = useClientIdentity();
  const { address } = useChain(chainName);
  const fetchBal = useAccountBalance(address as string).data;

  return (
    <ConnectedWalletButton
      identityName={
        identityOwnerQuery.status === "loading" ||
        identityOwnerQuery.status === "error"
        // @ts-ignore
          ? identityOwnerQuery.refetch() && "loading.."
          : identityName ?? "fetching identity.."
      }
      identityBalance={fetchBal?.unstaked ?? 0}
      identityStake={fetchBal?.staked ?? 0}
      buttonText={buttonText}
      onClickConnectBtn={onClick}
    />
  );
};

//returns circular loading
export const Connecting = () => {
  return <ConnectWalletButton isLoading={true} />;
};

export const Disconnected = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <ConnectWalletButton buttonText={buttonText} onClickConnectBtn={onClick} />
  );
};

export const Rejected = ({
  buttonText,
  wordOfWarning,
  onClick,
}: {
  buttonText: string;
  wordOfWarning?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  const bg = useColorModeValue("orange.200", "orange.300");

  return (
    <Stack>
      <ConnectWalletButton
        buttonText={buttonText}
        isDisabled={false}
        onClickConnectBtn={onClick}
      />
      {wordOfWarning && (
        <Stack
          isInline={true}
          borderRadius="md"
          bg={bg}
          color="blackAlpha.900"
          p={4}
          spacing={1}
        >
          <Icon as={FiAlertTriangle} mt={1} />
          <Text>
            <Text fontWeight="semibold" as="span">
              Warning:&ensp;
            </Text>
            {wordOfWarning}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export const Error = ({
  buttonText,
  wordOfWarning,
  onClick,
}: {
  buttonText: string;
  wordOfWarning?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  const bg = useColorModeValue("orange.200", "orange.300");

  useEffect(() => {
    checkJMESInKeplr().then((res) => {
      if (res === false) {
        addJMEStoKeplr();
      }
      return;
    });
  }, []);

  return (
    <Stack>
      <ConnectWalletButton
        buttonText={buttonText}
        isDisabled={false}
        onClickConnectBtn={onClick}
      />
      {wordOfWarning && (
        <Stack
          isInline={true}
          borderRadius="md"
          bg={bg}
          color="blackAlpha.900"
          p={4}
          spacing={1}
        >
          <Icon as={FiAlertTriangle} mt={1} />
          <Text>
            <Text fontWeight="semibold" as="span">
              Warning:&ensp;
            </Text>
            {wordOfWarning}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export const NotExist = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <ConnectWalletButton
      buttonText={buttonText}
      isDisabled={false}
      onClickConnectBtn={onClick}
    />
  );
};

export const WalletConnect = ({
  walletStatus,
  disconnect,
  connecting,
  connected,
  rejected,
  error,
  notExist,
}: {
  walletStatus: WalletStatus;
  disconnect: ReactNode;
  connecting: ReactNode;
  connected: ReactNode;
  rejected: ReactNode;
  error: ReactNode;
  notExist: ReactNode;
}) => {
  switch (walletStatus) {
    case WalletStatus.Disconnected:
      return <>{disconnect}</>;
    case WalletStatus.Connecting:
      return <>{connecting}</>;
    case WalletStatus.Connected:
      return <>{connected}</>;
    case WalletStatus.Rejected:
      return <>{rejected}</>;
    case WalletStatus.Error:
      return <>{error}</>;
    case WalletStatus.NotExist:
      return <>{notExist}</>;
    default:
      return <>{disconnect}</>;
  }
};
