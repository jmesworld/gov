import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Flex,
  Text,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Divider,
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../config/defaults";

export const ConnectedWalletButton = ({
  identityName,
  identityBalance,
}: {
  identityName: string;
  identityBalance: string;
}) => {
  const { address, disconnect, getCosmWasmClient, getSigningCosmWasmClient } =
    useChain(chainName);
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
                fontFamily="DM Sans"
              >
                {!!identityName
                  ? identityName
                  : `${address?.substring(0, 15)}...`}
              </Text>
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
              />
              <Text
                color="midnight"
                fontWeight="medium"
                fontSize={14}
                marginLeft={"6px"}
                marginRight={"6px"}
                noOfLines={1}
                fontFamily="DM Sans"
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
                  fontFamily="DM Sans"
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
};
