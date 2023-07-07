import { useAppState } from '../../contexts/AppStateContext';
import { useDAOContext } from '../../contexts/DAOContext';
import CreateGovProposal from '../../features/Governance/CreateGovProposal';
import { useRedirectToHomeForNoWalletConnected } from '../../hooks/Redirect';

const ProposalCreate = () => {
  const { setCreateGovProposalSelected } = useAppState();

  const { selectedDAO } = useDAOContext();

  const [Redirect] = useRedirectToHomeForNoWalletConnected();
  if (Redirect) return Redirect;
  return (
    <CreateGovProposal
      selectedDao={selectedDAO?.address}
      selectedDaoName={selectedDAO?.name}
      setCreateGovProposalSelected={setCreateGovProposalSelected}
    />
  );
};

export default ProposalCreate;
