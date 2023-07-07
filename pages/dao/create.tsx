import { useDAOContext } from '../../contexts/DAOContext';
import { useIdentityContext } from '../../contexts/IdentityContext';
import CreateDaoNewForm from '../../features/Dao/CreateDAO';
import { useRedirectToHomeForNoWalletConnected } from '../../hooks/Redirect';

const DAOCreate = () => {
  const { setSelectedDAOByAddress } = useDAOContext();
  const { getIdentityName, address } = useIdentityContext();

  const [Redirect] = useRedirectToHomeForNoWalletConnected();
  if (Redirect) return Redirect;
  return (
    <CreateDaoNewForm
      daoOwner={{
        address: address as string,
        name: getIdentityName() as string,
        votingPower: 0,
      }}
      setCreateDaoSelected={setSelectedDAOByAddress}
    />
  );
};

export default DAOCreate;
