import { DAOItemProps } from "../types";
import { Box, Divider, Flex, Text } from "@chakra-ui/react";

export const DAOList = ({ daos }: any) => {
  console.log(daos)
  if (!daos) {
    return (
      <Flex justifyContent="center" width="100%">
        <Text> No DAO has been created yet </Text>
      </Flex>
    );
  } else {
    const daoItems = daos.map((dao: {name: any, address: any}) => (
      <Text
        fontSize={18}
        marginLeft={8}
        marginTop={4}
        marginBottom={4}
        key={dao.name.toString()}
      >
        {dao.name}
      </Text>
    ));

    return <ul>{daoItems}</ul>;
  }
};
