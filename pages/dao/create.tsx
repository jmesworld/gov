import { useDAOContext } from '../../contexts/DAOContext';
import { useIdentityContext } from '../../contexts/IdentityContext';
import CreateDaoNewForm from '../../features/Dao/CreateDAO';

const DAOCreate = () => {
  const { setSelectedDAOByAddress } = useDAOContext();
  const { getIdentityName, address } = useIdentityContext();
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
