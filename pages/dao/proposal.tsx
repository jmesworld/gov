import { useAppState } from '../../contexts/AppStateContext';
import DaoProposalDetail from '../../features/Dao/components/DaoProposalDetail';

const DAOProposal = () => {
  const {
    selectedDao,
    selectedDaoName,
    selectedDaoProposalTitle,
    selectedDaoMembersList,
    selectedProposalId,
  } = useAppState();
  return (
    <DaoProposalDetail
      selectedDao={selectedDao}
      selectedDaoName={selectedDaoName}
      selectedDaoProposalTitle={selectedDaoProposalTitle}
      selectedDaoMembersList={selectedDaoMembersList}
      selectedDaoProposalId={selectedProposalId}
    />
  );
};

export default DAOProposal;
