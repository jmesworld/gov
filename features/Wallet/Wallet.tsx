import { useChain } from "@cosmos-kit/react";
import { Box, GridItem, Icon, Stack } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { FiAlertCircle, FiAlertOctagon, FiAlertTriangle } from "react-icons/fi";
import {
  Error,
  Connected,
  Connecting,
  ConnectStatusWarn,
  Disconnected,
  NotExist,
  Rejected,
  RejectedWarn,
  WalletConnect,
} from "./components";
import { chainName } from "../../config/defaults";

const Wallet = () => {
  const {
    connect,
    openView,
    status,
    username,
    address,
    message,
    wallet,
    chain: chainInfo,
    logoUrl,
  } = useChain(chainName);

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault();
    openView();
  };

  // Components

  const connectWalletButton = (
    <WalletConnect
      walletStatus={status}
      disconnect={
        <Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />
      }
      connecting={<Connecting />}
      connected={
        <Connected buttonText={"My Wallet"} onClick={onClickOpenView} />
      }
      rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
      error={<Error buttonText="Change Wallet" onClick={onClickOpenView} />}
      notExist={
        <NotExist buttonText="Install Wallet" onClick={onClickOpenView} />
      }
    />
  );

  const connectWalletWarn = (
    <ConnectStatusWarn
      walletStatus={status}
      rejected={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${wallet?.prettyName}: ${message}`}
        />
      }
      error={
        <RejectedWarn
          icon={<Icon as={FiAlertCircle} mt={1} />}
          wordOfWarning={`${wallet?.prettyName}: ${message}`}
        />
      }
    />
  );

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      borderRadius="lg"
      bg="transparent"
      spacing={4}
      px={4}
    >
      <Box>{connectWalletButton}</Box>
      {connectWalletWarn && <GridItem>{connectWalletWarn}</GridItem>}
    </Stack>
  );
};

export default Wallet;
