import { Box, Text, VStack, Divider } from '@chakra-ui/react';
import { ProposalProgress } from '../components/Proposal/ProposalProgress';

export interface Props {
  yesVotesPercentage: number;
  noVotesPercentage: number;
  yesPercent: number;
  yesCount: number;
  noCount: number;
  noPercent: number;
  target: number;
  targetPercentage: number;
}

const GovProposalVoting = ({
  yesPercent,
  noPercent,
  yesCount,
  noCount,
  targetPercentage,
  target,
}: Props) => {
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
          targetPercentage={targetPercentage}
          yesPercent={yesPercent}
          noPercent={noPercent}
          noCount={noCount}
          yesCount={yesCount}
          target={target}
        />
        <Divider borderColor="rgba(81, 54, 194, 0.3)" />
      </VStack>
    </Box>
  );
};

export default GovProposalVoting;
