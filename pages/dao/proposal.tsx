import { useAppState } from '../../contexts/AppStateContext';
import { useDAOContext } from '../../contexts/DAOContext';
import DaoProposalDetail from '../../features/Dao/components/DaoProposalDetail';

const DAOProposal = () => {
  const { selectedDAO } = useDAOContext();
  const { selectedDaoProposalTitle, selectedProposalId } = useAppState();
  if (!selectedDAO) {
    return 'no DAO selected';
  }
  return (
    <DaoProposalDetail
      selectedDao={selectedDAO?.address}
      selectedDaoName={selectedDAO?.name}
      selectedDaoProposalTitle={selectedDaoProposalTitle}
      selectedDaoProposalId={selectedProposalId}
    />
  );
};

export default DAOProposal;
