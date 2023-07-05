import { useRouter } from 'next/router';
import { Text } from '@chakra-ui/react';
import { useAppState } from '../../../contexts/AppStateContext';
import DaoProposal from '../../../features/Dao/components/DaoProposal';
import { useDAOContext } from '../../../contexts/DAOContext';
import DaoProposalDetail from '../../../features/Dao/components/DaoProposalDetail';

const DAODetail = () => {
  const { getSelectedDAOByName, selectedDAO } = useDAOContext();

  const {
    setSelectedDaoProposalTitle,
    setDaoProposalDetailOpen,
    setSelectedDaoMembersList,
    setSelectedProposalId,
  } = useAppState();
  const router = useRouter();
  const id = router.query.id;
  if (!id) {
    return <Text> DAO Not found</Text>;
  }
  if (Array.isArray(id) && id.length > 2) {
    const daoName = id[0];
    const proposalKey = id[1];
    const proposalId = id[2];
    if (proposalKey === 'proposals' && selectedDAO && daoName && proposalId) {
      return (
        <DaoProposalDetail
          selectedDao={selectedDAO.address}
          selectedDaoName={selectedDAO.name}
          selectedDaoProposalTitle={''}
          selectedDaoProposalId={Number(proposalId)}
        />
      );
    }
  }

  if (Array.isArray(id) && id.length === 1) {
    const doaName = id[0];
    const selectedDAO = getSelectedDAOByName(doaName);
    if (!selectedDAO) {
      return <Text> DAO Not found</Text>;
    }

    return (
      <>
        <DaoProposal
          daoAddress={selectedDAO.address}
          daoName={selectedDAO.name}
          setDaoProposalDetailOpen={setDaoProposalDetailOpen}
          setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
          setSelectedDaoMembersList={setSelectedDaoMembersList}
          setSelectedProposalId={setSelectedProposalId}
        />
      </>
    );
  }
  return null;
};

export default DAODetail;
