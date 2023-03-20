import { Box, Flex, Spacer, Image, Text, Button } from "@chakra-ui/react";
import { OnboardingProgressIndicator } from "./onboarding-progress-indicator";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../config/defaults";
import { connectKeplrWallet } from "../../actions/keplr";

export const ConnectWalletCard = ({
  radioGroup,
  currentCard,
  setCurrentCard,
  setIsInitalizing,
}: {
  radioGroup: Array<String>;
  currentCard: String;
  setCurrentCard: Function;
  setIsInitalizing: Function;
}) => {
  const { connect, walletRepo } = useChain(chainName);

  const handleUpdateCard = () => {
    const index = radioGroup.indexOf(currentCard);
    setCurrentCard(radioGroup[index + 1]);
    setIsInitalizing(false);
  };

  const handleConnectWallet = () => {
    connectKeplrWallet(walletRepo)
      .then((res) => {
        console.log("success");
      })
      .catch((error) => console.log(error));
    handleUpdateCard();
  };

  return (
    <Box
      width={"500px"}
      height={"590px"}
      alignItems={"center"}
      marginTop={"-50px"}
    >
      <Flex>
        <Spacer />
        <Image
          src="/Connect_Wallet.svg"
          alt="icon"
          width={"275.46px"}
          height={"248px"}
          justifySelf={"center"}
        />
        <Spacer />
      </Flex>
      <Flex>
        <Spacer />
        <Text
          color={"white"}
          fontWeight={"bold"}
          fontSize={28}
          paddingBottom={"6px"}
          paddingTop={"29px"}
          fontFamily="DM Sans"
        >
          Connect your JMES wallet
        </Text>
        <Spacer />
      </Flex>
      <Flex>
        <Spacer />
        <Text
          color={"white"}
          fontWeight={"normal"}
          fontSize={16}
          fontFamily="DM Sans"
        >
          Once you connect your wallet make sure you have
        </Text>
        <Spacer />
      </Flex>
      <Flex>
        <Spacer />
        <Text
          color={"white"}
          fontWeight={"normal"}
          fontSize={16}
          fontFamily="DM Sans"
        >
          JMES tokens so you can create a JMES identity
        </Text>
        <Spacer />
      </Flex>
      <Flex>
        <Spacer />
        <Text
          color={"white"}
          fontWeight={"normal"}
          fontSize={16}
          paddingBottom={"6px"}
          fontFamily="DM Sans"
        >
          and vote on Proposals.
        </Text>
        <Spacer />
      </Flex>
      <Flex py={"25px"}>
        <Spacer />
        <Button
          onClick={() => {
            handleConnectWallet();
          }}
          backgroundColor={"green"}
          borderRadius={90}
          alignContent="end"
          width={"200px"}
          height={"48px"}
          _hover={{ bg: "green" }}
          _active={{ bg: "green" }}
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
        <Spacer />
      </Flex>
      <Spacer />
      <OnboardingProgressIndicator activeCard="connect-wallet-card" />
    </Box>
  );
};
