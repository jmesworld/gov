import { useRouter } from 'next/router';
import { Text } from '@chakra-ui/react';
import { useAppState } from '../../../contexts/AppStateContext';
import DaoProposal from '../../../features/Dao/components/DaoProposal';
import { useDAOContext } from '../../../contexts/DAOContext';

const DAODetail = () => {
  const { getSelectedDAOByName } = useDAOContext();

  const {
    setSelectedDaoProposalTitle,
    setDaoProposalDetailOpen,
    setSelectedDaoMembersList,
    setSelectedProposalId,
  } = useAppState();
  const router = useRouter();
  const id = router.query.id;
  if (!id || Array.isArray(id)) {
    return <Text> DAO Not found</Text>;
  }

  const selectedDAO = getSelectedDAOByName(id);
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
};

export default DAODetail;
