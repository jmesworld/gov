import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { MouseEventHandler } from "react";
import { chainName } from "../../config/defaults";

export const ConnectButton = ({
  connectWallet,
}: {
  connectWallet: Function;
}) => {
  return (
    <Button
      onClick={() => connectWallet()}
      backgroundColor={"green"}
      borderRadius={90}
      alignContent="end"
      width={"159px"}
      height={"48px"}
      alignSelf="center"
      _hover={{ bg: "green" }}
      variant={"outline"}
      borderWidth={"1px"}
      borderColor={"rgba(0,0,0,0.1)"}
    >
      <Text
        color="midnight"
        fontFamily={"DM Sans"}
        fontWeight="medium"
        fontSize={14}
      >
        Connect Wallet
      </Text>
    </Button>
  );
};
