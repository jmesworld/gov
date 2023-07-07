import { Box, Flex, Spinner, Text, Tooltip } from '@chakra-ui/react';

import { NavBarItem } from '../NavBar/NavBarItem';
import { Link } from '../components/genial/Link';
import { useRouter } from 'next/router';
import { useDAOContext } from '../../contexts/DAOContext';
import { useIdentityContext } from '../../contexts/IdentityContext';

const MyDaoList = () => {
  const router = useRouter();
  const { daos, setSelectedDAOByName, loading, firstLoad, selectedDAO } =
    useDAOContext();
  const { address } = useIdentityContext();
  if (!address) {
    return null;
  }
  if (firstLoad && loading && !daos.length) {
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
        <Tooltip
          key={dao.name}
          closeOnClick={true}
          hasArrow={true}
          shouldWrapChildren={true}
          closeOnScroll={true}
          closeOnEsc={true}
          openDelay={500}
          label={dao.name}
        >
          <Link.withStatus
            key={dao.name}
            matchFunc={route => {
              if (route.pathname === '/dao/view/[...id]') {
                const ids = route.query?.id;
                return ids?.[0] === dao.name;
              }
              if (route.pathname === '/proposals/create') {
                return selectedDAO?.address === dao.address;
              }
              if (router.pathname === '/dao/proposals') {
                return selectedDAO?.address === dao.address;
              }
              return false;
            }}
            href={`/dao/view/${dao.name}`}
          >
            {({ isActive }) => (
              <NavBarItem
                key={dao.name}
                text={dao.name}
                isActive={router.route === '/dao/create'}
                isSelected={isActive}
                onClick={e => {
                  if (router.route === '/dao/create') {
                    e.preventDefault();
                  }
                  if (router.route === '/proposals/create') {
                    e.preventDefault();
                  }
                  if (router.route === '/dao/proposals') {
                    e.preventDefault();
                  }
                  setSelectedDAOByName(dao.name);
                }}
              />
            )}
          </Link.withStatus>
        </Tooltip>
      ))}
      <Flex height={'20px'} />
    </>
  );
};

const DAOListWrapper = () => {
  return (
    <Flex
      flexDirection="column"
      width="full"
      maxH={'50%'}
      overflowX="hidden"
      overflowY="auto"
    >
      <MyDaoList />
    </Flex>
  );
};

export default DAOListWrapper;
