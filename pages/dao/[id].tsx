import { useRouter } from 'next/router';
import type { NextPageWithLayout } from '../_app';
import { useAppState } from '../../contexts/AppStateContext';
import DaoProposal from '../../features/Dao/components/DaoProposal';

const DAODetail: NextPageWithLayout = () => {
  const {
    selectedDao,
    selectedDaoName,
    setSelectedDaoProposalTitle,
    setDaoProposalDetailOpen,
    setSelectedDaoMembersList,
    setSelectedProposalId,
  } = useAppState();
  const router = useRouter();
  const id = router.query.id;
  if (!id || Array.isArray(id)) {
    return <p> not Found </p>;
  }

  return (
    <>
      <DaoProposal
        daoAddress={selectedDao}
        daoName={selectedDaoName}
        setDaoProposalDetailOpen={setDaoProposalDetailOpen}
        setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
        setSelectedDaoMembersList={setSelectedDaoMembersList}
        setSelectedProposalId={setSelectedProposalId}
      />
    </>
  );
};

export default DAODetail;
