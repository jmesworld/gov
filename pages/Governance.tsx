import {
  Box,
  Flex,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import {
  useIdentityserviceDaosQuery,
} from "../client/Identityservice.react-query";
import { JMESLogo } from "../components";
import { NavBarItem } from "../components/react/navigation-item";
import GovernanceProposal from "./GovernanceProposal";
import { Ordering } from "../client/Identityservice.types";
import { DaoMultisigQueryClient } from "../client/DaoMultisig.client";
import { DaoMembersQueryClient } from "../client/DaoMembers.client";
import { useQuery } from "@tanstack/react-query";
import { DaoProposal } from "../components/DaoProposal";
import { NavBarButton } from "../components/react/navbar-button";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../config/defaults";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

let cosmWasmClient: CosmWasmClient;

export default function Governance() {
  const chainContext = useChain(chainName);
  const { address, getCosmWasmClient } = chainContext;

  const [isGovProposalSelected, setIsGovProposalSelected] = useState(true);
  const [selectedDao, setSelectedDao] = useState("");
  const [selectedDaoName, setSelectedDaoName] = useState("");
  const [isNewDataUpdated, setDataUpdated] = useState(false);

  const [viewDimension, setViewDimension] = useState(Array());
  const LCDOptions = {
    URL: LCD_URL,
    chainID: CHAIN_ID,
  };

  useEffect(() => {
    const init = async () => {
      cosmWasmClient = await getCosmWasmClient();
    };
    init().catch(console.error);
  });

  const order: Ordering = "descending";
  const args = { order: order, limit: 100000 };
  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
  );

  useEffect(() => {
    const { innerHeight, innerWidth } = window;
    setViewDimension([innerWidth, innerHeight]);
  }, []);

  const daosQuery = useIdentityserviceDaosQuery({ client, args });

  async function getMyDaos() {
    let myDaos: any = "undefined";

    let _data: any[] = [];
    let _startAfter = 0;
    let _isDataComplete = false;
    while (!_isDataComplete) {
      const _current_batch_data = await client.daos({
        limit: 30,
        startAfter: _startAfter,
        order: "ascending",
      });
      if (_current_batch_data.daos.length === 0) {
        _isDataComplete = true;
        break;
      }
      _data.push(..._current_batch_data.daos);
      _startAfter += 30;
    }
    _data.reverse();
    if (_data) {
      myDaos = [];
      for (const i in _data) {
        const daoAddrs = _data[i][1];

        const daoMultisigQueryClient = new DaoMultisigQueryClient(
          cosmWasmClient,
          daoAddrs
        );
        const daoMembersQueryClient = new DaoMembersQueryClient(
          cosmWasmClient,
          daoAddrs
        );

        const voter: any = await daoMultisigQueryClient.voter({
          address: address as string,
        });

        if (voter.weight >= 0) {
          const config = await daoMultisigQueryClient.config();
          myDaos.push({
            name: config.dao_name,
            address: daoAddrs,
          });
        }
      }
    }
    return myDaos;
  }

  const myDaos = useQuery(["myDaos"], getMyDaos, {
    onSuccess: (data) => {
      let storeData = new Map<string, any>();
      storeData.set(address as string, data);
      localStorage.setItem(
        "myDaosData",
        JSON.stringify(Object.fromEntries(storeData))
      );
      setDataUpdated(true);
    },
    refetchInterval: 10,
  });

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
          isSelected={isGovProposalSelected}
          onClick={() => {
            setIsGovProposalSelected(true);
            setSelectedDao("");
            setSelectedDaoName("");
          }}
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
        {typeof window !== "undefined" &&
        address !== "undefined" &&
        !(localStorage.getItem("myDaosData") as string)?.includes(
          "undefined"
        ) ? (
          <MyDaosList
            daos={localStorage.getItem("myDaosData") as string}
            selectedDao={selectedDao}
            setSelectedDao={setSelectedDao}
            setIsGovProposalSelected={setIsGovProposalSelected}
            selectedDaoName={selectedDaoName}
            setSelectedDaoName={setSelectedDaoName}
          />
        ) : (
          <></>
        )}
        <Flex height={"10px"} />
        <NavBarButton
          width="180px"
          height="42px"
          text={isGovProposalSelected ? "Create DAO" : "New DAO"}
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
      {isGovProposalSelected ? (
        <GovernanceProposal />
      ) : (
        <DaoProposal daoAddress={selectedDao} daoName={selectedDaoName} />
      )}
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
