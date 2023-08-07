import {
  Flex,
  HStack,
  Text,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Tooltip,
} from '@chakra-ui/react';
import { Link } from '../genial/Link';
import { timestampToDateTime } from '../../../utils/time';
import { ChevronRightIcon } from '@chakra-ui/icons';

export const ProposalHeader = ({
  title,
  daoName,
  proposalTitle,
  proposalExpiry,
  tab,
}: {
  title?: string;
  daoName?: string;
  proposalTitle: string;
  proposalExpiry: number;
  tab?: string;
}) => {
  return (
    <Flex direction="column">
      <Breadcrumb
        separator={<ChevronRightIcon color="#7453FD" fontSize={'28px'} />}
      >
        <BreadcrumbItem>
          <Link href={daoName ? `/dao/view/${daoName}` : `/${tab ?? ''}`}>
            <Text
              color="purple"
              fontFamily="DM Sans"
              fontWeight="thin"
              fontSize={28}
              display="inline-block"
              cursor="pointer"
            >
              {title}
            </Text>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Tooltip hasArrow label={proposalTitle} aria-label="A tooltip">
            <Text
              color="darkPurple"
              fontFamily="DM Sans"
              fontSize={28}
              wordBreak={'break-all'}
              noOfLines={1}
              fontWeight="bold"
            >
              {proposalTitle}
            </Text>
          </Tooltip>
        </BreadcrumbItem>
      </Breadcrumb>
      {/* <Box
        color={'#5136C2'}
        fontFamily="DM Sans"
        fontWeight="medium"
        fontSize={28}
      >
        <Link href={daoName ? `/dao/view/${daoName}` : `/${tab ?? ''}`}>
          <Text decoration="underline" display="inline-block" cursor="pointer">
            {title}
          </Text>
        </Link>
        <ChevronRightIcon color="purple" />
        {proposalTitle}
      </Box> */}
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
