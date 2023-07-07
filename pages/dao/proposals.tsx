import { useDAOContext } from '../../contexts/DAOContext';
import { useIdentityContext } from '../../contexts/IdentityContext';
import { DAOProposalPage } from '../../features/Dao/DAOProposal';
import { useRedirectToHomeForNoWalletConnected } from '../../hooks/Redirect';

const DAOProposal = () => {
  const { selectedDAO, setSelectedDAOByAddress } = useDAOContext();
  const { getIdentityName, address } = useIdentityContext();

  const [Redirect] = useRedirectToHomeForNoWalletConnected();
  if (Redirect) return Redirect;
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
