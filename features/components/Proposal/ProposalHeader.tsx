import { Flex, HStack, Text, Box } from '@chakra-ui/react';
import { Link } from '../genial/Link';
import { timestampToDateTime } from '../../../utils/time';

export const ProposalHeader = ({
  title,
  daoName,
  proposalTitle,
  proposalExpiry,
}: {
  title?: string;
  daoName?: string;
  proposalTitle: string;
  proposalExpiry: number;
}) => {
  return (
    <Flex direction="column">
      <Box
        color={'#5136C2'}
        fontFamily="DM Sans"
        fontWeight="medium"
        fontSize={28}
      >
        <Link href={daoName ? `/dao/view/${daoName}` : '/'}>
          <Text decoration="underline" display="inline-block" cursor="pointer">
            {title}
          </Text>
        </Link>
        &nbsp;&#x2022;&nbsp;
        {proposalTitle}
      </Box>
      <HStack hidden={proposalExpiry <= 0} marginTop="38px" marginBottom="16px">
        <Text
          textTransform="uppercase"
          color="rgba(15, 0, 86, 0.8)"
          fontSize={12}
          fontWeight="medium"
          fontFamily="DM Sans"
        >
          Voting ends {timestampToDateTime(proposalExpiry / 1e3)}
        </Text>
      </HStack>
    </Flex>
  );
};
