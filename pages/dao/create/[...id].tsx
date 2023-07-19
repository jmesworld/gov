import { Text, Flex, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { DAOProposal } from '../../../features/create/DaoProposals';
import { GovProposalCreate } from '../../../features/create/GovProposal';
import { useRedirectToHomeForNoWalletConnected } from '../../../hooks/Redirect';
import { useDAOContext } from '../../../contexts/DAOContext';
import { useIdentityContext } from '../../../contexts/IdentityContext';

const CreateProposal = () => {
  const router = useRouter();
  const { address } = useIdentityContext();
  const { setSelectedDAOByName, getSelectedDAOByName, firstLoad } =
    useDAOContext();

  const id = router?.query.id;
  const [Redirect] = useRedirectToHomeForNoWalletConnected();
  if (Redirect) return Redirect;
  if (firstLoad && address) {
    return (
      <Flex alignItems="center" justifyContent="center" h="full" w="full">
        <Spinner size="lg" color="purple" mr="2" />
      </Flex>
    );
  }

  if (!Array.isArray(id)) {
    return null;
  }

  const daoName = id?.[0];
  const createType = id?.[1];
  setSelectedDAOByName(daoName);
  const selectedDao = getSelectedDAOByName(daoName);
  if (!selectedDao) {
    return <Text> DAO not found</Text>;
  }

  if (!daoName || !createType) {
    return <Text>Not valid</Text>;
  }

  if (createType === 'daoproposal') {
    return <DAOProposal />;
  }

  if (createType === 'govproposal') {
    return <GovProposalCreate />;
  }
  return null;
};

export default CreateProposal;
