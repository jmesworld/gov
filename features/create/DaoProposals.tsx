import { useRouter } from 'next/router';
import { Text } from '@chakra-ui/react';
import { useDAOContext } from '../../contexts/DAOContext';
import { useIdentityContext } from '../../contexts/IdentityContext';
import { DAOProposalPage, ProposalTypes } from '../Dao/DAOProposal';

export const DAOProposal = () => {
  const router = useRouter();
  const { selectedDAO, setSelectedDAOByAddress } = useDAOContext();
  const { getIdentityName, address } = useIdentityContext();

  if (!selectedDAO) {
    return <Text>no DAO selected </Text>;
  }
  const selectedTab = (router.query.tab as ProposalTypes) ?? undefined;

  return (
    <DAOProposalPage
      selectedTab={selectedTab}
      identityName={getIdentityName() as string}
      daoAddress={selectedDAO.address}
      selectedDaoName={selectedDAO.name}
      daoOwner={{
        address: address as string,
        name: getIdentityName() as string,
        votingPower: 0,
      }}
      setCreateDaoSelected={setSelectedDAOByAddress}
    />
  );
};
