import { Box, Flex, Spinner, Text } from '@chakra-ui/react';

import { NavBarItem } from '../NavBar/NavBarItem';
import { Link } from '../components/genial/Link';
import { useRouter } from 'next/router';
import { useDAOContext } from '../../contexts/DAOContext';
import { useIdentityContext } from '../../contexts/IdentityContext';

const MyDaoList = () => {
  const router = useRouter();
  const { daos, setSelectedDAOByName, loading, selectedDAO } = useDAOContext();
  const { address } = useIdentityContext();
  if (!address) {
    return null;
  }
  if (loading && !daos.length) {
    return (
      <Box marginLeft="25px">
        <Text
          alignItems="center"
          fontSize="sm"
          size="sm"
          display="flex"
          color="white"
        >
          <Spinner color="white" size="xs" mr="2" />
          <span>loading ...</span>
        </Text>
      </Box>
    );
  }

  return (
    <>
      {daos?.map(dao => (
        <Link.withStatus
          key={dao.name}
          matchFunc={route => {
            if (
              route.route === '/proposals/create' &&
              selectedDAO?.name === dao.name
            ) {
              return true;
            }
            return route.asPath === `/dao/${dao.name}`;
          }}
          href={`/dao/${dao.name}`}
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
                setSelectedDAOByName(dao.name);
              }}
            />
          )}
        </Link.withStatus>
      ))}
      <Flex height={'20px'} />
    </>
  );
};

const DAOListWrapper = () => {
  return (
    <Flex flexDirection="column" height={'50%'}>
      <MyDaoList />
    </Flex>
  );
};

export default DAOListWrapper;
