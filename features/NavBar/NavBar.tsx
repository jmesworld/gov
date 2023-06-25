import { VStack, Box, Flex, Text, Spacer, Image } from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import dynamic from "next/dynamic";
import { NavBarItem } from "./NavBarItem";
import { NavBarButton } from "./NavBarButton";
import { useClientIdentity } from "../../hooks/useClientIdentity";
import { useEffect, useState } from "react";
const MyDaoList = dynamic(() => import("../Dao/MyDaoList"));

interface NavBarProps {
  status: WalletStatus;
  address: any;
  identityName: string | undefined;
  isGovProposalSelected: boolean;
  setIsGovProposalSelected: React.Dispatch<React.SetStateAction<boolean>>;
  isCreateDaoSelected: boolean;
  isCreateGovProposalSelected: boolean;
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
  address,
  status,
  identityName,
  isGovProposalSelected,
  setIsGovProposalSelected,
  isCreateDaoSelected,
  isCreateGovProposalSelected,
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
  console.log(identityName)
  return (
    <VStack
      width={"200px"}
      height={"100%"}
      backgroundColor={"#7453FD"}
      paddingTop={"30px"}
      paddingLeft={"0px"}
      overflowY="scroll"
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
        isSelected={
          isGovProposalSelected &&
          !isCreateDaoSelected &&
          !isCreateGovProposalSelected
        }
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
        disabled={status !== WalletStatus.Connected || !!!identityName}
        onClick={() => {
          if (!WalletStatus.Connected) {
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
        // disabled={status !== WalletStatus.Connected}
        disabled={true} // TODO: remove later
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
        disabled={
          status !== WalletStatus.Connected ||
          isGovProposalSelected ||
          !!!identityName
        }
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
