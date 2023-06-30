import { useAppState } from '../../contexts/AppStateContext';
import { useDAOContext } from '../../contexts/DAOContext';
import CreateGovProposal from '../../features/Governance/CreateGovProposal';

const ProposalCreate = () => {
  const { setCreateGovProposalSelected } = useAppState();

  const { selectedDAO } = useDAOContext();
  return (
    <CreateGovProposal
      selectedDao={selectedDAO?.address}
      selectedDaoName={selectedDAO?.name}
      setCreateGovProposalSelected={setCreateGovProposalSelected}
    />
  );
};

export default ProposalCreate;
