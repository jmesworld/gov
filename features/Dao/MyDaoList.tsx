import { Flex } from '@chakra-ui/react';
import { useChain } from '@cosmos-kit/react';
import { chainName } from '../../config/defaults';
import { NavBarItem } from '../NavBar/NavBarItem';
import { Link } from '../components/genial/Link';
import { useAppState } from '../../contexts/AppStateContext';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const MyDaoList = ({
  daos,
  setSelectedDao,
  setSelectedDaoName,
}: {
  daos: any;
  selectedDao: string;
  setSelectedDao: Function;
  selectedDaoName: string;
  setSelectedDaoName: Function;
}) => {
  const router = useRouter();
  const chainContext = useChain(chainName);
  const { selectedDao } = useAppState();
  const { address } = chainContext;

  const daosJSON = useMemo(() => {
    try {
      return JSON.parse(daos);
    } catch (err) {
      return undefined;
    }
  }, [daos]);

  if (!daosJSON) {
    return <></>;
  }

  if (!daosJSON[address as string]) {
    return <></>;
  } else if (Array.from(daosJSON[address as string]).length === 0) {
    return <></>;
  } else {
    const daoItems = daosJSON[address as string].map(
      (dao: { name: any; address: any }) => (
        <Link.withStatus
          key={dao.address}
          matchFunc={route => {
            return (
              (route.pathname === '/dao/[id]' &&
                route.query?.id === dao.address) ||
              ((route.pathname === '/proposals/create' ||
                router.pathname === '/dao/create') &&
                selectedDao === dao.address)
            );
          }}
          href={`/dao/${dao.address}`}
        >
          {({ isActive }) => (
            <NavBarItem
              key={dao.name}
              text={dao.name}
              isSelected={isActive}
              onClick={e => {
                if (router.route === '/proposals/create') {
                  e.preventDefault();
                }
                setSelectedDao(dao.address);
                setSelectedDaoName(dao.name);
              }}
            />
          )}
        </Link.withStatus>
      ),
    );
    return (
      <>
        <ul>{daoItems}</ul>
        <Flex height={'20px'} />
      </>
    );
  }
};
export default MyDaoList;
