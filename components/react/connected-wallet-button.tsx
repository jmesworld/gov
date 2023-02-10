import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Flex,
  Text,
  Image,
  Box,
  background,
  Button,
  VStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Divider,
} from "@chakra-ui/react";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/stargate";
import { useChain } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { BjmesTokenQueryClient } from "../../client/BjmesToken.client";
import { useBjmesTokenBalanceQuery } from "../../client/BjmesToken.react-query";
import { DaoMultisigClient } from "../../client/DaoMultisig.client";
import { GovernanceClient } from "../../client/Governance.client";
import {
  IdentityserviceClient,
  IdentityserviceQueryClient,
} from "../../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../../client/Identityservice.react-query";
import { chainName } from "../../config/defaults";

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const BJMES_TOKEN_CONTRACT = process.env
  .NEXT_PUBLIC_BJMES_TOKEN_CONTRACT as string;

export function ConnectedWalletButton() {
  const { address, disconnect, getCosmWasmClient, getSigningCosmWasmClient } =
    useChain(chainName);

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

  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceQueryClient,
    args: { owner: address ? address : "" },
  });

  const identityOwnerBalanceQuery = useBjmesTokenBalanceQuery({
    client: bjmesTokenQueryClient,
    args: { address: address as string },
    options: {
      refetchInterval: 10,
    },
  });

  const identityName = identityOwnerQuery?.data?.identity?.name as string;
  const identityBalance = identityOwnerBalanceQuery?.data?.balance as string;

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            _hover={{ bg: "white" }}
            _expanded={{ bg: "white" }}
            backgroundColor="white"
            borderColor="rgba(116, 83, 253, 0.3)"
            as={Button}
            rightIcon={
              isOpen ? (
                <ChevronUpIcon
                  alignSelf={"center"}
                  width={"24px"}
                  height={"24px"}
                  color={"purple"}
                />
              ) : (
                <ChevronDownIcon
                  alignSelf={"center"}
                  width={"24px"}
                  height={"24px"}
                  color={"purple"}
                />
              )
            }
            width={"271px"}
            height={"48px"}
            variant={"outline"}
            borderWidth={"1px"}
            borderRadius={"90px"}
          >
            <Flex width={"100%"} alignItems={"center"}>
              <Image src="/Wallet.svg" alt="Wallet Icon"></Image>
              <Text
                color="darkPurple"
                fontWeight="medium"
                fontSize={14}
                marginLeft={"6px"}
              >{`${!!identityName ? identityName : ""}`}</Text>
              <Spacer />
              <Divider
                orientation="vertical"
                backgroundColor={"lilac"}
                height={"22px"}
                marginLeft={"9px"}
                marginRight={"9px"}
              />
              <Image
                src="/JMES_Icon.svg"
                alt="JMES Icon"
                width={"9px"}
                height={"10.98px"}
              ></Image>
              <Text
                color="midnight"
                fontWeight="medium"
                fontSize={14}
                marginLeft={"6px"}
                marginRight={"6px"}
              >{`${!!identityBalance ? identityBalance : ""}`}</Text>
            </Flex>
          </MenuButton>
          <MenuList
            backgroundColor="white"
            _hover={{ bg: "white" }}
            borderColor="rgba(116, 83, 253, 0.3)"
            borderWidth={1}
            width={"271px"}
            borderRadius={"20px"}
            padding={0}
          >
            <MenuItem
              backgroundColor="white"
              _hover={{ bg: "white" }}
              borderRadius={"20px"}
              onClick={() => {
                disconnect();
              }}
            >
              {" "}
              <Flex
                width={"100%"}
                height={"38px"}
                alignItems={"center"}
                paddingLeft={"4px"}
              >
                <Image
                  src="/Disconnect_Wallet.svg"
                  alt="Disconnect"
                  width={"24px"}
                  height={"24px"}
                ></Image>{" "}
                <Text
                  color="darkPurple"
                  fontWeight="medium"
                  fontSize={14}
                  marginLeft={"6px"}
                >
                  Disconnect
                </Text>
              </Flex>
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
}
