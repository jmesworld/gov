import { useAppState } from '../../contexts/AppStateContext';
import { useDAOContext } from '../../contexts/DAOContext';
import { useIdentityContext } from '../../contexts/IdentityContext';
import SpendDaoFundsForm from '../../features/Dao/SpendDaoFundsForm';
import DaoProposalDetail from '../../features/Dao/components/DaoProposalDetail';

const DAOProposal = () => {
  const { selectedDAO, setSelectedDAOByAddress } = useDAOContext();
  const { getIdentityName , address } = useIdentityContext(); 
  const { selectedDaoProposalTitle, selectedProposalId } = useAppState();
  if (!selectedDAO) {
    return 'no DAO selected';
  }
  return (
    <SpendDaoFundsForm
      identityName={getIdentityName() as string}
      selectedDao={selectedDAO?.address}
      selectedDaoName={selectedDAO?.name}
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
