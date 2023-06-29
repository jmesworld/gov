import {
  Flex,
  HStack,
  Box,
  Link,
  Text,
  Tooltip,
  Image,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { ProposalProgress } from "./ProposalProgress";
import { ProposalVotes } from "./ProposalVotes";

export interface ProposalVoting {
  yesPercentage: number;
  noPercentage: number;
  target: number;
  votes: Array<any>;
}

export const ProposalVoting = (props: ProposalVoting) => {
  const yesVotes = props.votes.filter((vote) => vote.vote === "yes");
  const noVotes = props.votes.filter((vote) => vote.vote === "no");

  return (
    <Box borderRadius="12px" background="#7453FD" padding="18px 20px">
      <VStack align="flex-start" spacing="20px">
        <Text
          color="#fff"
          fontSize={16}
          fontWeight="medium"
          fontFamily="DM Sans"
        >
          To Pass
        </Text>
        <ProposalProgress
          yesPercent={40}
          noPercent={60}
          target={50}
        />
        <Divider borderColor="rgba(81, 54, 194, 0.3)" />
        <HStack align="flex-start" spacing="10px" width="100%">
          <ProposalVotes
            type="yes"
            percentage={props.yesPercentage}
            votes={yesVotes}
          ></ProposalVotes>
          <ProposalVotes
            type="no"
            percentage={100 - props.yesPercentage}
            votes={noVotes}
          ></ProposalVotes>
        </HStack>
      </VStack>
    </Box>
  );
};
