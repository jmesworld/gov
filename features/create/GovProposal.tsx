import { useAppState } from '../../contexts/AppStateContext';
import { useDAOContext } from '../../contexts/DAOContext';
import CreateGovProposal from '../Governance/CreateGovProposal';

export const GovProposalCreate = () => {
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
