import { useRouter } from 'next/router';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useAppState } from '../../../contexts/AppStateContext';
import DaoProposal from '../../../features/Dao/components/DaoProposal';
import { useDAOContext } from '../../../contexts/DAOContext';
import DaoProposalDetail from '../../../features/Dao/components/DaoProposalDetail';
import { useRedirectToHomeForNoWalletConnected } from '../../../hooks/Redirect';
import { ClosePageButton } from '../../../features/components/genial/ClosePageButton';
import { NotFound } from '../../../features/components/common/notFound';

const DAODetail = () => {
  const { getSelectedDAOByName, afterCreate, firstLoad } = useDAOContext();
  const {
    setSelectedDaoProposalTitle,
    setDaoProposalDetailOpen,
    setSelectedDaoMembersList,
    setSelectedProposalId,
  } = useAppState();
  const router = useRouter();

  const [redirect] = useRedirectToHomeForNoWalletConnected();
  if (redirect) return redirect;

  const id = router.query.id;
  const daoName = id?.[0];
  const selectedDAO = getSelectedDAOByName(daoName ?? null);
  const proposalKey = id?.[1];
  const proposalId = id?.[2];

  if (!id) {
    return <NotFound title="DAO not found." />;
  }
  if (Array.isArray(id) && id.length > 2) {
    if (proposalKey === 'proposals' && selectedDAO && daoName && proposalId) {
      return (
        <Flex h="100%" gap="4" justifyContent="space-between" flexDir="column">
          <Box>
            <DaoProposalDetail
              selectedDao={selectedDAO.address}
              selectedDaoName={selectedDAO.name}
              selectedDaoProposalTitle={''}
              selectedDaoProposalId={Number(proposalId)}
            />
          </Box>
          <Box>
            <ClosePageButton
              onClose={() => {
                router.push(`/dao/view/${daoName}`);
              }}
            />
          </Box>
        </Flex>
      );
    }
  }

  if (Array.isArray(id) && id.length === 1) {
    if ((afterCreate !== '' && !selectedDAO) || firstLoad) {
      return (
        <Flex alignItems="center" justifyContent="center" w="full" h="full">
          <Spinner color="purple" size="lg" mr="2" />
        </Flex>
      );
    }
    if (!selectedDAO) {
      return (
        <NotFound
          title="DAO not found."
          description="The DAO you are looking for does not exist."
        />
      );
    }

    return (
      <DaoProposal
        daoAddress={selectedDAO.address}
        daoName={selectedDAO.name}
        setDaoProposalDetailOpen={setDaoProposalDetailOpen}
        setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
        setSelectedDaoMembersList={setSelectedDaoMembersList}
        setSelectedProposalId={setSelectedProposalId}
      />
    );
  }
  return null;
};

export default DAODetail;
