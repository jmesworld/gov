import { Flex } from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { chainName } from "../../config/defaults";
import { NavBarItem } from "../components/NavBar/NavBarItem";

const MyDaosList = ({
  daos,
  setIsGovProposalSelected,
  selectedDao,
  setSelectedDao,
  selectedDaoName,
  setSelectedDaoName,
  setCreateDaoSelected,
  setDaoProposalDetailOpen,
  setGovProposalDetailOpen,
}: {
  daos: any;
  setIsGovProposalSelected: Function;
  selectedDao: string;
  setSelectedDao: Function;
  selectedDaoName: string;
  setSelectedDaoName: Function;
  setCreateDaoSelected: Function;
  setDaoProposalDetailOpen: Function;
  setGovProposalDetailOpen: Function;
}) => {
  const chainContext = useChain(chainName);
  const { address } = chainContext;
  const daosJSON = JSON.parse(daos);

  if (!daosJSON) {
    return <></>;
  }

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
            setCreateDaoSelected(false);
            setDaoProposalDetailOpen(false);
            setGovProposalDetailOpen(false);
          }}
        />
      )
    );
    return (
      <>
        <ul>{daoItems}</ul>
        <Flex height={"20px"} />
      </>
    );
  }
};
export default MyDaosList;
