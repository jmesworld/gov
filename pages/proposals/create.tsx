import { useAppState } from '../../contexts/AppStateContext';
import CreateGovProposal from '../../features/Governance/CreateGovProposal';

const ProposalCreate = () => {
  const { selectedDao, selectedDaoName, setCreateGovProposalSelected } =
    useAppState();
  return (
    <CreateGovProposal
      selectedDao={selectedDao}
      selectedDaoName={selectedDaoName}
      setCreateGovProposalSelected={setCreateGovProposalSelected}
    />
  );
};

export default ProposalCreate;
