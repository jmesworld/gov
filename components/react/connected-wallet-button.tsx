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
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../config/defaults";

export const ConnectedWalletButton = ({identityName}: {identityName: string}) => {
  const chainContext = useChain(chainName);
  const { address, disconnect } = chainContext;
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            _hover={{ bg: "#E7E2F8" }}
            as={Button}
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
            width={"230px"}
            height={"42px"}
            backgroundColor="transparent"
            borderColor="rgba(116, 83, 253, 0.3)"
            variant={"outline"}
            borderWidth={"1px"}
            borderRadius={"90px"}
          >
            <Flex>
              <Image src="/Wallet_Icon.svg" alt="Wallet Icon"></Image>
              <Flex width={"117px"} paddingLeft={"8px"}>
                <VStack spacing={0}>
                  <Text
                    color="#7453FD"
                    fontFamily={"DM Sans"}
                    fontWeight="medium"
                    fontSize={14}
                    alignSelf="self-start"
                    padding={0}
                  >{`Hi ${identityName}`}</Text>
                  <Text
                    color="#7453FD"
                    fontFamily={"DM Sans"}
                    fontWeight="medium"
                    fontSize={12}
                  >{`${address?.slice(0, 8)}...${address?.slice(
                    address?.length - 10,
                    address?.length
                  )}`}</Text>
                </VStack>
              </Flex>
            </Flex>
          </MenuButton>
          <MenuList
            backgroundColor="transparent"
            borderColor={"rgba(116, 83, 253, 0.3)"}
            borderWidth={1}
          >
            <MenuItem>
              <Flex>
                <Image
                  src="/Settings.svg"
                  alt="Settings"
                  width={"22.66px"}
                  height={"22.66px"}
                  backgroundColor="#E7E2F8"
                ></Image>{" "}
                <Text
                  color="#7453FD"
                  fontFamily={"DM Sans"}
                  fontWeight="medium"
                  fontSize={14}
                  marginLeft={"18px"}
                >
                  Settings
                </Text>
              </Flex>
            </MenuItem>
            <MenuItem
              onClick={() => {
                disconnect();
              }}
            >
              {" "}
              <Flex>
                <Image
                  src="/Disconnect.svg"
                  alt="Disconnect"
                  width={"22.66px"}
                  height={"22.66px"}
                  backgroundColor="#E7E2F8"
                ></Image>{" "}
                <Text
                  color="#7453FD"
                  fontFamily={"DM Sans"}
                  fontWeight="medium"
                  fontSize={14}
                  marginLeft={"18px"}
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
