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
import { disconnect } from "process";
import { MouseEventHandler } from "react";
import { chainName } from "../../config/defaults";

export const ConnectWalletSection = () => {
  const chainContext = useChain(chainName);
  const { username, status } = chainContext;

  return (
    <Box
      width={"881px"}
      height={"217px"}
      backgroundColor="#704FF7"
      borderRadius={12}
      paddingTop="32px"
      paddingRight="33px"
    >
      <Grid templateColumns="repeat(4, 1fr)" templateRows="repeat(1, 1fr)">
        <GridItem colSpan={1}>
          <Image
            src="/Connect_Wallet.svg"
            alt="Connect Wallet"
            width={"177.44px"}
            height={"159.75px"}
            marginLeft={"54px"}
          ></Image>
        </GridItem>
        <GridItem colSpan={3}>
          <Box marginLeft={"69px"}>
            <Text
              color={"white"}
              fontFamily="DM Sans"
              fontSize={28}
              fontWeight="normal"
            >
              {status === WalletStatus.Connected
                ? `Welcome ${username}`
                : "Firstly, let's connect a wallet"}
            </Text>
            {status !== WalletStatus.Connected ? <ConnectKelprExtension /> : ""}
            {status !== WalletStatus.Connected ? <ConnectKelprMobile /> : ""}
            {status === WalletStatus.Connected ? <ConnectedKelprWallet /> : ""}
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export const ConnectKelprExtension = () => {
  const chainContext = useChain(chainName);
  const { connect } = chainContext;

  return (
    <Flex marginTop={"18px"}>
      <Image
        src="/Keplr.svg"
        alt="Keplr"
        width={"34px"}
        height={"34px"}
        marginTop={"1px"}
        alignSelf="center"
      ></Image>
      <Text
        marginLeft={"20px"}
        marginTop={"2px"}
        color="white"
        fontFamily={"DM Sans"}
        fontWeight="normal"
        fontSize={18}
        alignSelf="center"
      >
        Keplr extension
      </Text>
      <Spacer />
      <ConnectButton
        onClick={async (e) => {
          e.preventDefault();
          await connect();
          if (typeof window !== "undefined") {
            localStorage.setItem("myDaosData", "undefined");
          }
        }}
      />
    </Flex>
  );
};

export const ConnectKelprMobile = () => {
  const chainContext = useChain(chainName);
  const { connect } = chainContext;
  return (
    <Flex marginTop={"19px"}>
      <Image
        src="/Keplr.svg"
        alt="Keplr"
        width={"34px"}
        height={"34px"}
        marginTop={"1px"}
        alignSelf="center"
      ></Image>
      <Text
        marginLeft={"20px"}
        marginTop={"2px"}
        color="white"
        fontFamily={"DM Sans"}
        fontWeight="normal"
        fontSize={18}
        alignSelf="center"
      >
        Keplr Mobile
      </Text>
      <Spacer />
      <ConnectButton
        onClick={async (e) => {
          e.preventDefault();
          await connect();
          if (typeof window !== "undefined") {
            localStorage.setItem("myDaosData", "undefined");
          }
        }}
      />
    </Flex>
  );
};

export const ConnectButton = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <Button
      onClick={onClick}
      backgroundColor={"#A1F0C4"}
      borderRadius={90}
      alignContent="end"
      width={"128px"}
      height={"42px"}
      alignSelf="center"
    >
      <Text
        color="#0F0056"
        fontFamily={"DM Sans"}
        fontWeight="medium"
        fontSize={14}
      >
        Connect
      </Text>
    </Button>
  );
};

export const ConnectedKelprWallet = () => {
  const chainContext = useChain(chainName);
  const { address, disconnect } = chainContext;

  return (
    <Flex marginTop={"19px"}>
      <Flex
        width={"100%"}
        height={"49px"}
        backgroundColor="#5136C2"
        borderRadius={12}
        marginRight={"21px"}
        alignItems="center"
        justifyContent="center"
        alignSelf="center"
      >
        <Text
          color="white"
          fontFamily={"DM Sans"}
          fontWeight="normal"
          fontSize={16}
          alignSelf="center"
        >
          {address}
        </Text>
      </Flex>
      <Spacer />
      <DisconnectButton
        onClick={async (e) => {
          disconnect();
        }}
      />
    </Flex>
  );
};

export const DisconnectButton = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <Button
      onClick={onClick}
      backgroundColor={"#A1F0C4"}
      borderRadius={90}
      alignContent="end"
      width={"128px"}
      height={"42px"}
      alignSelf="center"
    >
      <Text
        color="#0F0056"
        fontFamily={"DM Sans"}
        fontWeight="medium"
        fontSize={14}
      >
        Disconnect
      </Text>
    </Button>
  );
};
