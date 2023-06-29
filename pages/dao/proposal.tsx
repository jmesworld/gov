import { useAppState } from '../../contexts/AppStateContext';
import DaoProposalDetail from '../../features/Dao/components/DaoProposalDetail';

const DAOProposal = () => {
  const {
    selectedDao,
    selectedDaoName,
    selectedDaoProposalTitle,
    selectedProposalId,
  } = useAppState();
  return (
    <DaoProposalDetail
      selectedDao={selectedDao}
      selectedDaoName={selectedDaoName}
      selectedDaoProposalTitle={selectedDaoProposalTitle}
      selectedDaoProposalId={selectedProposalId}
    />
  );
};

export default DAOProposal;
