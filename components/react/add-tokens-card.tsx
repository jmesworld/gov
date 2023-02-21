import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Spacer,
  Image,
  Text,
  Button,
  useClipboard,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { OnboardingProgressIndicator } from "./onboarding-progress-indicator";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../config/defaults";
import { useEffect, useState } from "react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { IdentityserviceQueryClient } from "../../client/Identityservice.client";
import { BjmesTokenQueryClient } from "../../client/BjmesToken.client";
import { useBjmesTokenBalanceQuery } from "../../client/BjmesToken.react-query";

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const BJMES_TOKEN_CONTRACT = process.env
  .NEXT_PUBLIC_BJMES_TOKEN_CONTRACT as string;

export const AddTokensCard = ({
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
  const toast = useToast()
  const { address, disconnect, getCosmWasmClient } = useChain(chainName);

  const handleUpdateCard = () => {
    const index = radioGroup.indexOf(currentCard);
    if (index < radioGroup.length - 1) {
      setCurrentCard(radioGroup[index + 1]);
    } else {
      setCurrentCard(radioGroup[0]);
    }
    setIsInitalizing(false);
  };

  const [identityBalance, setIdentityBalance] = useState("");
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  useEffect(() => {
    getCosmWasmClient()
      .then((cosmWasmClient) => {
        if (!cosmWasmClient || !address) {
          return;
        }
        setCosmWasmClient(cosmWasmClient);
      })
      .catch((error) => console.log(error));
  }, [address, getCosmWasmClient]);

  const identityserviceQueryClient: IdentityserviceQueryClient =
    new IdentityserviceQueryClient(
      cosmWasmClient as CosmWasmClient,
      IDENTITY_SERVICE_CONTRACT
    );
  const bjmesTokenQueryClient: BjmesTokenQueryClient =
    new BjmesTokenQueryClient(
      cosmWasmClient as CosmWasmClient,
      BJMES_TOKEN_CONTRACT
    );
  const identityOwnerBalanceQuery = useBjmesTokenBalanceQuery({
    client: bjmesTokenQueryClient,
    args: { address: address as string },
    options: {
      refetchInterval: 10,
      onSuccess: (data) => {
        setIdentityBalance(identityOwnerBalanceQuery?.data?.balance as string);
      },
    },
  });

  useEffect(() => {
    if (parseInt(identityBalance) > 0) {
      handleUpdateCard();
    }
  });

  return (
    <Box
      width={"500px"}
      height={"590px"}
      alignItems={"center"}
      marginTop={"-41px"}
    >
      <Flex>
        <Spacer />
        <Image
          src="/Barcode.svg"
          alt="icon"
          width={"232px"}
          height={"234px"}
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
          paddingBottom={"4px"}
          marginTop={"34px"}
        >
          Add tokens to wallet
        </Text>
        <Spacer />
      </Flex>
      <Flex>
        <Spacer />
        <Box width={"151px"} paddingRight={"11px"}>
          <Text color={"white"} fontWeight={"normal"} fontSize={12}>
            Balance
          </Text>
          <Flex
            width={"100%"}
            height={"49px"}
            borderColor={"darkPurple"}
            borderWidth={"1px"}
            borderRadius={"12px"}
            marginTop={"8px"}
            px={"16px"}
            alignItems={"center"}
          >
            <Image
              src="/JMES_Icon_white.svg"
              alt="JMES Icon"
              width={"16.4px"}
              height={"20px"}
              fill={"white"}
            />
            <Text
              color={"white"}
              fontWeight={"normal"}
              fontSize={18}
              marginLeft={"10.6px"}
              noOfLines={1}
            >
              {`${!!identityBalance ? identityBalance : "loading..."}`}
            </Text>
          </Flex>
        </Box>
        <Box width={"279px"}>
          <Text color={"white"} fontWeight={"normal"} fontSize={12}>
            Address
          </Text>
          <Flex
            width={"100%"}
            height={"49px"}
            borderColor={"darkPurple"}
            backgroundColor={"darkPurple"}
            borderRadius={"12px"}
            marginTop={"8px"}
            px={"13px"}
            alignItems={"center"}
          >
            <Text
              color={"white"}
              fontWeight={"normal"}
              fontSize={18}
              marginLeft={"14px"}
              noOfLines={1}
            >
              {`${address?.slice(0, 13)}...${address?.slice(
                address.length - 4,
                address.length
              )}`}
            </Text>
            <IconButton
              width={"24px"}
              height={"24px"}
              marginLeft={"14px"}
              aria-label={''}
              backgroundColor={"transparent"}
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
              onClick={() => {
                navigator.clipboard.writeText(address as string);
                toast({
                  title: 'Copied to clipboard',
                  description: "",
                  status: 'success',
                  duration: 1000,
                })
              }}
            >
              <CopyIcon
                width={"24px"}
                height={"24px"}
                color={"white"}
                type={"button"}
              />
            </IconButton>
          </Flex>
        </Box>
        <Spacer />
      </Flex>
      <Flex marginBottom={"25px"} marginTop={"38px"}>
        <Spacer />
        <Button
          disabled={!identityOwnerBalanceQuery?.data}
          onClick={() => {
            disconnect();
            setCurrentCard(null)
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
            Disconnect
          </Text>
        </Button>
        <Spacer />
      </Flex>
      <Spacer />
      <OnboardingProgressIndicator activeCard="add-tokens-card" />
    </Box>
  );
};
