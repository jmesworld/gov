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
import { chainName } from "../../../config/defaults";
import { ConnectedWalletType } from "../../types";

export const ConnectedWalletButton = ({
  identityName,
  identityBalance,
  identityStake,
  isLoading,
  isDisabled,
}: ConnectedWalletType) => {
  const { address, disconnect } = useChain(chainName);
  const handleDisconnect = () => {
    disconnect();
    window.location.reload();
  };
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
            isLoading={isLoading}
            isDisabled={isDisabled}
            rightIcon={
              isOpen ? (
                <ChevronUpIcon
                  alignSelf={"center"}
                  width={"24px"}
                  height={"24px"}
                  color={"#7453FD"}
                />
              ) : (
                <ChevronDownIcon
                  alignSelf={"center"}
                  width={"24px"}
                  height={"24px"}
                  color={"#7453FD"}
                />
              )
            }
            maxW={"400px"}
            minW={"271px"}
            height={"48px"}
            variant={"outline"}
            borderWidth={"1px"}
            borderRadius={"90px"}
          >
            <Flex width={"100%"} alignItems={"center"}>
              <Image
                src="/Wallet.svg"
                width={"16px"}
                height={"16px"}
                alt="Wallet Icon"
              />
              <Text
                color="#7453FD"
                fontWeight="bold"
                fontSize={12}
                marginLeft={"5.3px"}
                fontFamily="DM Sans"
              >
                {!!identityName
                  ? identityName
                  : `${address?.substring(0, 11)}...`}
              </Text>
              <Spacer marginLeft={"13px"} />

              <Image
                src="/JMES_Icon.svg"
                alt="JMES Icon"
                width={"9px"}
                height={"10.98px"}
              />
              <Text
                color="#0F0056"
                fontWeight="bold"
                fontSize={12}
                marginLeft={"5px"}
                noOfLines={1}
                fontFamily="DM Sans"
              >{`${
                !!identityBalance
                  ? identityBalance
                  : "0.0"
              }`}</Text>

              <Divider
                orientation="vertical"
                backgroundColor={"lilac"}
                height={"22px"}
                marginLeft={"5px"}
                marginRight={"9px"}
              />
              <Image
                src="/JMES_bonded_icon.svg"
                alt="JMES bonded Icon"
                width={"12px"}
                height={"13px"}
              />
              <Text
                color="midnight"
                fontWeight="bold"
                fontSize={12}
                marginLeft={"5px"}
                noOfLines={1}
                fontFamily="DM Sans"
              >{`${
                !!identityStake
                  ? identityStake
                  : "0.0"
              }`}</Text>
            </Flex>
          </MenuButton>
          <MenuList
            backgroundColor="white"
            _hover={{ bg: "white" }}
            borderColor="rgba(116, 83, 253, 0.3)"
            borderWidth={1}
            width={"100%"}
            borderRadius={"20px"}
            padding={0}
            minW={"271px"}
            maxW={"400px"}
          >
            <MenuItem
              backgroundColor="white"
              _hover={{ bg: "white" }}
              borderRadius={"20px"}
              onClick={handleDisconnect}
            >
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
                ></Image>
                <Text
                  color="darkPurple"
                  fontWeight="medium"
                  fontSize={14}
                  marginLeft={"6px"}
                  fontFamily="DM Sans"
                >
                  Disconnect
                </Text>
                <Spacer/>
              </Flex>
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};
