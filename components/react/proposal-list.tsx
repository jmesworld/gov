import { DAOItemProps } from "../types";
import { Box, Divider, Flex, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export const ProposalList = ({ proposals, daoAddress }: any) => {
  if (!proposals || Array.from(proposals).length === 0) {
    return (
      <Flex justifyContent="center" width="100%">
        <Text> No proposal has been created yet </Text>
      </Flex>
    );
  } else {
    const proposalItems = proposals.map((proposal: any) => (
      <NextLink
        key={proposal.id}
        href={{
          pathname: "/ProposalDetail",
          query: { id:  proposal.id, address: daoAddress },
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
            <Text fontSize={18} marginLeft={8} key={proposal.id}>
              {proposal.title}
            </Text>
          </Box>
        </Link>
      </NextLink>
    ));

    return <ul>{proposalItems}</ul>;
  }
};
