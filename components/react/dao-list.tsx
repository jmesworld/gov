import { DAOItemProps } from "../types";
import { Box, Divider, Flex, Link, Spinner, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useWallet } from "@cosmos-kit/react";

export const DAOList = ({ daos }: any) => {
  const walletManager = useWallet();
  const { address } = walletManager;
  const daosJSON = JSON.parse(daos);

  if (!daosJSON[address as string]) {
    return <Spinner color="red.500" />;
  } else if (Array.from(daosJSON[address as string]).length === 0) {
    return (
      <Flex justifyContent="center" width="100%">
        <Text> No DAO has been created yet </Text>
      </Flex>
    );
  } else {
    const daoItems = daosJSON[address as string].map(
      (dao: { name: any; address: any }) => (
        <NextLink
          key={dao.name}
          href={{
            pathname: "/Proposals",
            query: { name: dao.name, address: dao.address },
          }}
          passHref={true}
        >
          <Link fontSize={24}>
            <Box
              height={54}
              width={1000}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize={18} marginLeft={8} key={dao.name.toString()}>
                {dao.name}
              </Text>
            </Box>
          </Link>
        </NextLink>
      )
    );

    return <ul>{daoItems}</ul>;
  }
};
