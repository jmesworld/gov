import { VStack, Box, Flex, Text, Spacer } from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import { NavBarItem } from "./NavBarItem";
import { NavBarButton } from "./NavBarButton";

import { JMESLogo } from "../components/Assets/JMESLogo";
import MyDaosList from "../Dao/MyDaoList";

import { useState } from "react";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../config/defaults";

// Main component
interface NavBarProps {
  setSelectedSection: any;
  selectedSection: any;
  data: any;
}
const NavBar = ({ setSelectedSection, selectedSection, data }: NavBarProps) => {
  const { address, status } = useChain(chainName);

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
      <JMESLogo />
      <Box height={"30px"} />
      <Flex
        width={"200px"}
        height={"42px"}
        // marginTop={"30px"}
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
        isSelected={!!!selectedSection}
        onClick={() => {
          setSelectedSection(selectedSection);
        }}
      />

      <Box height={"27px"} />
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
          MY DAOS
        </Text>
      </Flex>
      {typeof window !== "undefined" &&
      address !== "undefined" &&
      !(localStorage.getItem("myDaosData") as string)?.includes("undefined") ? (
        <MyDaosList
          daos={localStorage.getItem("myDaosData") as string}
          selectedDao={selectedSection}
          setSelectedDao={setSelectedSection("daoProposalDetail")}
        />
      ) : (
        <></>
      )}
      <NavBarButton
        width="180px"
        height="48px"
        text={"New DAO"}
        disabled={data.isIdentityCreated}
        onClick={() => {
          setSelectedSection("createDao");
        }}
      />
      <Spacer />
      <NavBarButton
        width="180px"
        height="48px"
        text="DAO Proposal"
        disabled={
          status !== WalletStatus.Connected || selectedSection === "daoProposal"
        }
        onClick={() => {
          setSelectedSection("daoProposal");
        }}
      />
      <NavBarButton
        width="180px"
        height="48px"
        text="GOV Proposal"
        disabled={
          status !== WalletStatus.Connected || selectedSection === "govProposal"
        }
        onClick={() => {
          setSelectedSection("govProposal");
        }}
      />
      <Flex height={"10px"} />
    </VStack>
  );
};

export default NavBar;
