import { DAOItemProps } from "../types";
import { Box, Divider, Flex, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export const DAOList = ({ daos }: any) => {

  if (!daos) {
    return (
      <Flex justifyContent="center" width="100%">
        <Text> No DAO has been created yet </Text>
      </Flex>
    );
  } else {
    const daoItems = daos.map((dao: { name: any; address: any }) => (
      <NextLink
        key={dao.name}
        href={{
          pathname: "/Proposals",
          query: { name: dao.name, address: dao.address },
        }}
        passHref={true}
      >
        <Link fontSize={24}>
          <Box height={54} width={1000} justifyContent='center' alignItems='center'>
            <Text fontSize={18} marginLeft={8} key={dao.name.toString()}>
              {dao.name}
            </Text>
          </Box>
        </Link>
      </NextLink>
    ));

    return <ul>{daoItems}</ul>;
  }
};
