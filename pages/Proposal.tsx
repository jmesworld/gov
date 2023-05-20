import {
    Box,
    Flex,
    HStack,
    Spacer,
    Text,
    VStack,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { JMESLogo } from "../components";
  import { NavBarItem } from "../components/react/navigation-item";
  import { NavBarButton } from "../components/react/navbar-button";
  import { useChain } from "@cosmos-kit/react";
  import { chainName } from "../config/defaults";
  import { ProposalHeader } from "../components/react/proposal/proposal-header";
  import { ProposalVoting } from "../components/react/proposal/proposal-voting";
  import { ProposalMyVote } from "../components/react/proposal/proposal-my-vote";
  import { ProposalDaoMembers } from "../components/react/proposal/proposal-dao-members";
  
  export default function Governance() {
    const [viewDimension, setViewDimension] = useState(Array());

    useEffect(() => {
      const { innerHeight, innerWidth } = window;
      setViewDimension([innerWidth, innerHeight]);
    }, []);
  
    return (
      <Flex padding={0} width={viewDimension[0]} height={viewDimension[1]}>
        <VStack
          width={"200px"}
          height={"100%"}
          backgroundColor={"#7453FD"}
          paddingTop={"30px"}
          paddingLeft={"0px"}
          // overflowY="scroll"
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
            isSelected={true}
            onClick={() => {}}
          />
          <Box height={"42px"} />
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
          <Flex height={"10px"} />
          <NavBarButton
            width="180px"
            height="42px"
            text="Create DAO"
            marginLeft="10px"
            marginRight="10px"
            disabled={false}
            onClick={() => {}}
          />
          <Spacer />
          <NavBarButton
            width="180px"
            height="42px"
            text="DAO Proposal"
            marginLeft="10px"
            marginRight="10px"
            disabled={false}
            onClick={() => {}}
          />
          <NavBarButton
            width="180px"
            height="42px"
            text="GOV Proposal"
            marginLeft="10px"
            marginRight="10px"
            disabled={false}
            onClick={() => {}}
          />
          <Flex height={"10px"} />
        </VStack>
        <Box
            width={"100%"}
            height={"100%"}
            backgroundColor={"rgba(198, 180, 252, 0.3)"}
            padding="25px 54px"
            overflowY="scroll"
            flexGrow={"1"}
        >
            <ProposalHeader />
            <HStack spacing="54px" align="flex-start">
                <Box flexGrow={1}>
                    <ProposalVoting yesPercentage={65.00} target={60.00} />
                    <Box background="rgba(112, 79, 247, 0.1)" borderRadius="12px" border="1px solid rgba(112, 79, 247, 0.5)" padding="14px 16px" marginTop="20px" height="300px">
                        <Text fontSize="16px" fontWeight="normal" color="rgba(81, 54, 194, 1)" fontFamily="DM Sans">Description</Text>
                    </Box>
                    <Box background="rgba(112, 79, 247, 0.1)" borderRadius="12px" border="1px solid rgba(112, 79, 247, 0.5)" padding="14px 16px" marginTop="20px" height="300px">
                        <Text fontSize="16px" fontWeight="normal" color="rgba(81, 54, 194, 1)" fontFamily="DM Sans">Proposal History</Text>
                    </Box>
                </Box>
                <VStack width="330px" spacing="30px" align="flex-start">
                    <ProposalMyVote />
                    <ProposalDaoMembers />
                </VStack>
            </HStack>
            
        </Box>
      </Flex>
    );
  }
  
  export const MyDaosList = ({
    daos,
    setIsGovProposalSelected,
    selectedDao,
    setSelectedDao,
    selectedDaoName,
    setSelectedDaoName,
  }: {
    daos: any;
    setIsGovProposalSelected: Function;
    selectedDao: string;
    setSelectedDao: Function;
    selectedDaoName: string;
    setSelectedDaoName: Function;
  }) => {
    const chainContext = useChain(chainName);
    const { address } = chainContext;
    const daosJSON = JSON.parse(daos);
  
    if (!daosJSON[address as string]) {
      return <></>;
    } else if (Array.from(daosJSON[address as string]).length === 0) {
      return <></>;
    } else {
      const daoItems = daosJSON[address as string].map(
        (dao: { name: any; address: any }) => (
          <NavBarItem
            key={dao.name}
            text={dao.name}
            isSelected={selectedDao === dao.address ? true : false}
            onClick={() => {
              setIsGovProposalSelected(false);
              setSelectedDao(dao.address);
              setSelectedDaoName(dao.name);
            }}
          />
        )
      );
      return <ul>{daoItems}</ul>;
    }
  };
  