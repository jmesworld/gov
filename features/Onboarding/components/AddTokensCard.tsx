import { ArrowBackIcon, CloseIcon, CopyIcon } from "@chakra-ui/icons";
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
import OnboardingProgressIndicator from "./OnboardingProgressIndicator";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../../config/defaults";
import { useEffect, useState } from "react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useAccountBalance } from "../../../hooks/useAccountBalance";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../../../client/Identityservice.react-query";
import { IdentityserviceQueryClient } from "../../../client/Identityservice.client";

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const BJMES_TOKEN_CONTRACT = process.env
  .NEXT_PUBLIC_BJMES_TOKEN_CONTRACT as string;

const AddTokensCard = ({
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
  const toast = useToast();
  const [identityName, setIdentityName] = useState<
    IdentityserviceQueryClient | string
  >();
  const [identityBalance, setIdentityBalance] = useState("");
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );

  const [isAddTokensCardVisible, setAddTokensCardVisible] = useState(true);

  const { address, disconnect, getCosmWasmClient, wallet } =
    useChain(chainName);
  const identityBalanceQuery = useAccountBalance(address as string);
  const balance: any = identityBalanceQuery.data ?? 0;

  const identityserviceQueryClient: IdentityserviceQueryClient =
    new IdentityserviceQueryClient(
      cosmWasmClient as CosmWasmClient,
      IDENTITY_SERVICE_CONTRACT
    );

  const identityNameQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceQueryClient,
    args: { owner: address as string },
    options: {
      onSuccess: (data) => {
        if (!!data?.identity?.name.toString()) {
          setIdentityName(data?.identity?.name.toString());
        }
      },
      onError: (error) => {
        console.log(error);
      },
    },
  });

  const handleUpdateCard = () => {
    if (balance > 0 && identityName !== undefined) {
      // setCurrentCard(null); //this is a hack to remove the current card from the screen. A better way to do this is to have a state variable that controls whether or not the card is visible. For example, you could have a state variable called "isCardVisible" and set it to true or false depending on whether or not you want the card to be visible. Then, you could use a ternary operator to render the card only if isCardVisible is true. For example: {isCardVisible ? <Card /> : null}. This is better because it is more explicit.
      console.log("success fetching identity", identityName);
      setAddTokensCardVisible(false);
      setIsInitalizing(false);
    } else if (balance > 0 && identityName === undefined) {
      setIsInitalizing(false);
      console.log("error fetching identity", identityName);
      setCurrentCard(radioGroup[radioGroup.indexOf(currentCard) + 1]);
    }
  };

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

  useEffect(() => {
    if (identityNameQuery.isSuccess) {
      handleUpdateCard();
    } else if (identityNameQuery.isError) {
      handleUpdateCard();
    }
  }),
    [];

  return (
    <>
      {isAddTokensCardVisible ? (
        <Box
          width={"500px"}
          height={"590px"}
          alignItems={"center"}
          marginTop={"-41px"}
        >
          <Flex>
            <Flex width={"100%"} justifyContent={"space-between"}>
              <Image
                src="/Barcode.svg"
                alt="icon"
                width={"232px"}
                height={"234px"}
                justifySelf={"center"}
              />
            </Flex>
            <Spacer />
          </Flex>
          <Flex>
            <Spacer />
            <Text
              color={"white"}
              fontWeight={"bold"}
              fontSize={28}
              fontFamily="DM Sans"
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
              <Text
                color={"white"}
                fontWeight={"normal"}
                fontSize={12}
                fontFamily="DM Sans"
              >
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
                  fontFamily="DM Sans"
                >
                  {`${identityBalanceQuery.isSuccess ? balance : "loading..."}`}
                </Text>
              </Flex>
            </Box>
            <Box width={"279px"}>
              <Text
                color={"white"}
                fontWeight={"normal"}
                fontSize={12}
                fontFamily="DM Sans"
              >
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
                  fontFamily="DM Sans"
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
                  aria-label={""}
                  backgroundColor={"transparent"}
                  _hover={{ bg: "transparent" }}
                  _active={{ bg: "transparent" }}
                  onClick={() => {
                    navigator.clipboard.writeText(address as string);
                    toast({
                      title: "Copied to clipboard",
                      description: "",
                      status: "success",
                      duration: 1000,
                    });
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
              disabled={!identityBalanceQuery.isSuccess}
              onClick={() => {
                disconnect();
                setCurrentCard(null);
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
      ) : null}
    </>
  );
};

export default AddTokensCard;
