import { Box, Text, VStack, Badge, Flex } from '@chakra-ui/react';
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
  label?: {
    label: string;
    success: boolean;
  };
}

const GovProposalVoting = ({
  yesPercent,
  noPercent,
  yesCount,
  noCount,
  targetPercentage,
  target,
  label,
}: Props) => {
  return (
    <Box borderRadius="12px" background="#7453FD" padding="18px 20px">
      <VStack align="flex-start" spacing="10px">
        <ProposalProgress
          targetPercentage={targetPercentage}
          yesPercent={yesPercent}
          noPercent={noPercent}
          noCount={noCount}
          yesCount={yesCount}
          target={target}
        />
        {label && (
          <Flex alignItems="center" w="full">
            <Badge
              fontWeight="normal"
              color="black"
              rounded="full"
              px="2"
              bg={label.success ? 'green' : 'red'}
            >
              {label.label}
            </Badge>
          </Flex>
        )}
      </VStack>
    </Box>
  );
};

export default GovProposalVoting;
