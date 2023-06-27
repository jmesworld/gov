import { useChain } from '@cosmos-kit/react';
import CreateDaoForm from '../../features/Dao/CreateDaoForm';
import { chainName } from '../../config/defaults';
import { useAppState } from '../../contexts/AppStateContext';

const DAOCreate = () => {
  const { address } = useChain(chainName);
  const { identityName, setCreateDaoSelected } = useAppState();
  return (
    <CreateDaoForm
      daoOwner={{
        address: address as string,
        name: identityName as string,
        votingPower: 0,
      }}
      setCreateDaoSelected={setCreateDaoSelected}
    />
  );
};

export default DAOCreate;
