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

import GovProposalVotes from "./GovProposalVotes";
import { ProposalProgress } from "../components/Proposal/ProposalProgress";

export interface GovProposalVoting {
  target: number;
  yesVotesCount: number;
  noVotesCount: number;
  yesVotesPercentage: number;
  noVotesPercentage: number;
}

const GovProposalVoting = (props: GovProposalVoting) => {
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
          <GovProposalVotes
            type="yes"
            percentage={props.yesVotesPercentage}
            votes={props.yesVotesCount}
          ></GovProposalVotes>
          <GovProposalVotes
            type="no"
            percentage={props.noVotesPercentage}
            votes={props.noVotesCount}
          ></GovProposalVotes>
        </HStack>
      </VStack>
    </Box>
  );
};

export default GovProposalVoting;
