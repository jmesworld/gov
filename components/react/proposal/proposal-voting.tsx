import { Flex, HStack, Box, Link, Text, Tooltip, Image, VStack, Divider } from "@chakra-ui/react";
import { ProposalProgress } from "./proposal-progress";
import { ProposalVotes } from "./proposal-votes";

export interface ProposalVoting {
  yesPercentage: number;
  target: number;
}

export const ProposalVoting = (props: ProposalVoting) => {
  const dummyYes = [{"wallet":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","voteValue":25},{"wallet":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","voteValue":5},{"wallet":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","voteValue":5},{"wallet":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","voteValue":5},{"wallet":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","voteValue":5},{"wallet":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","voteValue":5},{"wallet":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","voteValue":2},{"wallet":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","voteValue":2},{"wallet":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","voteValue":2},{"wallet":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","voteValue":2},{"wallet":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","voteValue":2},{"wallet":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","voteValue":2}]
  const dummyNo = [{"wallet":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","voteValue":3}]

  return (
    <Box borderRadius="12px" background="#7453FD" padding="18px 20px">
        <VStack align="flex-start" spacing="20px">
            <Text color="#fff" fontSize={16} fontWeight="medium" fontFamily="DM Sans">To Pass</Text>
            <ProposalProgress progress={props.yesPercentage} target={props.target} />
            <Divider borderColor="rgba(81, 54, 194, 0.3)" />
            <HStack align="flex-start" spacing="10px" width="100%">
              <ProposalVotes type="yes" percentage={65.00} voters={dummyYes}></ProposalVotes>
              <ProposalVotes type="no" percentage={3.00} voters={dummyNo}></ProposalVotes>
            </HStack>
        </VStack>
    </Box>
  );
}