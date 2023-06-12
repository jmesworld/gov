import {
  Flex,
  HStack,
  Box,
  Link,
  Text,
  Tooltip,
  Image,
} from "@chakra-ui/react";

export const ProposalHeader = ({
  daoName,
  proposalTitle,
  proposalExpiry,
}: {
  daoName: string;
  proposalTitle: string;
  proposalExpiry: number;
}) => {
  return (
    <Flex direction="column">
      <Text
        color={"#5136C2"}
        fontFamily="DM Sans"
        fontWeight="medium"
        fontSize={28}
      >
        <Link href="#" textDecoration={"underline"}>
          {daoName}
        </Link>
        &nbsp;&#x2022;&nbsp;
        {proposalTitle}
      </Text>
      <HStack hidden={proposalExpiry <= 0} marginTop="38px" marginBottom="16px">
        <Text
          textTransform="uppercase"
          color="rgba(15, 0, 86, 0.8)"
          fontSize={12}
          fontWeight="medium"
          fontFamily="DM Sans"
        >
          Voting ends {convertTimestamp(proposalExpiry)} UTC
        </Text>
        <Tooltip label="Info">
          <Image
            src="/tooltip.svg"
            alt="Info"
            width={"13.33px"}
            height={"13.33px"}
          ></Image>
        </Tooltip>
      </HStack>
    </Flex>
  );
};

const convertTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};
