import { useRouter } from 'next/router';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import { useAppState } from '../../../contexts/AppStateContext';
import DaoProposal from '../../../features/Dao/components/DaoProposal';
import { useDAOContext } from '../../../contexts/DAOContext';
import DaoProposalDetail from '../../../features/Dao/components/DaoProposalDetail';
import { useRedirectToHomeForNoWalletConnected } from '../../../hooks/Redirect';

const DAODetail = () => {
  const { getSelectedDAOByName, afterCreate, firstLoad } = useDAOContext();
  const {
    setSelectedDaoProposalTitle,
    setDaoProposalDetailOpen,
    setSelectedDaoMembersList,
    setSelectedProposalId,
  } = useAppState();
  const router = useRouter();

  const [Redirect] = useRedirectToHomeForNoWalletConnected();
  if (Redirect) return Redirect;

  const id = router.query.id;
  const daoName = id?.[0];
  const selectedDAO = getSelectedDAOByName(daoName ?? null);
  const proposalKey = id?.[1];
  const proposalId = id?.[2];

  if (!id) {
    return <Text> DAO Not found</Text>;
  }
  if (Array.isArray(id) && id.length > 2) {
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
    if ((afterCreate !== '' && !selectedDAO) || firstLoad) {
      return (
        <Flex alignItems="center">
          <Spinner size="sm" mr="2" />
          <Text>Loading DAO ...</Text>
        </Flex>
      );
    }
    if (!selectedDAO) {
      return <Text> DAO Not Found !</Text>;
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
