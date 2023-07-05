import { useDAOContext } from '../../contexts/DAOContext';
import { useIdentityContext } from '../../contexts/IdentityContext';
import { DAOProposalPage } from '../../features/Dao/DAOProposal';

const DAOProposal = () => {
  const { selectedDAO, setSelectedDAOByAddress } = useDAOContext();
  const { getIdentityName, address } = useIdentityContext();
  if (!selectedDAO) {
    return 'no DAO selected';
  }
  return (
    <DAOProposalPage
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

export default DAOProposal;
