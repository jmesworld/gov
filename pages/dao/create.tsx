import { useChain } from '@cosmos-kit/react';
import CreateDaoForm from '../../features/Dao/CreateDaoForm';
import { chainName } from '../../config/defaults';
import { useDAOContext } from '../../contexts/DAOContext';
import { useIdentityContext } from '../../contexts/IdentityContext';

const DAOCreate = () => {
  const { address } = useChain(chainName);
  const { setSelectedDAOByAddress } = useDAOContext();
  const { getIdentityName } = useIdentityContext();
  return (
    <CreateDaoForm
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
