import { VStack, Box, Flex, Text, Spacer, Image } from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import dynamic from "next/dynamic";
import { NavBarItem } from "./NavBarItem";
import { NavBarButton } from "./NavBarButton";
import { useClientIdentity } from "../../hooks/useClientIdentity";
const MyDaoList = dynamic(() => import("../Dao/MyDaoList"));

interface NavBarProps {
  status: WalletStatus;
  address: any;
  identityName: string | undefined;
  isGovProposalSelected: boolean;
  setIsGovProposalSelected: React.Dispatch<React.SetStateAction<boolean>>;
  isCreateDaoSelected: boolean;
  setCreateDaoSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDao: React.Dispatch<React.SetStateAction<string>>;
  setSelectedDaoName: React.Dispatch<React.SetStateAction<string>>;
  setCreateGovProposalSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setDaoProposalDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGovProposalDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDao: string;
  selectedDaoName: string;
  setConnectButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar = ({
  status,
  address,

  isGovProposalSelected,
  setIsGovProposalSelected,
  isCreateDaoSelected,
  setCreateDaoSelected,
  setSelectedDao,
  setSelectedDaoName,
  setCreateGovProposalSelected,
  setDaoProposalDetailOpen,
  setGovProposalDetailOpen,
  selectedDao,
  selectedDaoName,
  setConnectButtonClicked,
}: NavBarProps) => {
  const { identityName } = useClientIdentity();
  return (
    <VStack
      width={"200px"}
      height={"100%"}
      backgroundColor={"#7453FD"}
      paddingTop={"30px"}
      paddingLeft={"0px"}
      // overflowY="scroll"
      alignItems="start"
    >
      <Image
        src="./Logo.svg"
        alt="JMES"
        width={"83.37px"}
        height={"24px"}
        marginLeft={"26px"}
      />
      <Box height={"30px"} />
      <Flex
        width={"200px"}
        height={"42px"}
        paddingLeft={"26px"}
        backgroundColor={"#7453FD"}
      >
        {" "}
        <Text
          color="#A1F0C4"
          fontFamily={"DM Sans"}
          fontWeight="bold"
          fontSize={12}
          alignSelf="center"
        >
          GOVERNANCE
        </Text>
      </Flex>
      <NavBarItem
        text="Proposals"
        isSelected={isGovProposalSelected}
        onClick={() => {
          setIsGovProposalSelected(true);
          setCreateDaoSelected(false);
          setSelectedDao("");
          setSelectedDaoName("");
          setCreateGovProposalSelected(false);
          setDaoProposalDetailOpen(false);
        }}
      />
      <Box height={"27px"} />
      <Flex
        width={"200px"}
        height={"42px"}
        paddingLeft={"26px"}
        backgroundColor={"#7453FD"}
      >
        <Text
          color="#A1F0C4"
          fontFamily={"DM Sans"}
          fontWeight="bold"
          fontSize={12}
          alignSelf="center"
        >
          MY DAOS
        </Text>
      </Flex>
      {typeof window !== "undefined" &&
      address !== "undefined" &&
      !(localStorage.getItem("myDaosData") as string)?.includes("undefined") ? (
        <MyDaoList
          daos={localStorage.getItem("myDaosData") as string}
          selectedDao={selectedDao}
          setSelectedDao={setSelectedDao}
          setIsGovProposalSelected={setIsGovProposalSelected}
          selectedDaoName={selectedDaoName}
          setSelectedDaoName={setSelectedDaoName}
          setCreateDaoSelected={setCreateDaoSelected}
          setDaoProposalDetailOpen={setDaoProposalDetailOpen}
          setGovProposalDetailOpen={setGovProposalDetailOpen}
        />
      ) : (
        <></>
      )}
      <NavBarButton
        width="180px"
        height="48px"
        text={"New DAO"}
        disabled={!identityName}
        onClick={() => {
          if (status !== WalletStatus.Connected) {
            setConnectButtonClicked(true);
          } else {
            setCreateGovProposalSelected(false);
            setCreateDaoSelected(true);
            setDaoProposalDetailOpen(false);
            setGovProposalDetailOpen(false);
          }
        }}
      />
      <Spacer />
      <NavBarButton
        width="180px"
        height="48px"
        text="DAO Proposal"
        disabled={!identityName}
        onClick={() => {
          setCreateGovProposalSelected(false);
          setDaoProposalDetailOpen(true);
          setGovProposalDetailOpen(false);
        }}
      />
      <NavBarButton
        width="180px"
        height="48px"
        text="GOV Proposal"
        disabled={!identityName}
        onClick={() => {
          setCreateGovProposalSelected(true);
          setDaoProposalDetailOpen(false);
          setGovProposalDetailOpen(false);
        }}
      />
      <Flex height={"10px"} />
    </VStack>
  );
};

export default NavBar;
