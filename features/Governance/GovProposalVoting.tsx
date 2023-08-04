import { ReactNode } from 'react';
import { Box, VStack, Badge, Flex } from '@chakra-ui/react';
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

export const ProposalHeadingContainer = ({
  children,
}: {
  children?: ReactNode;
}) => {
  return (
    <Box borderRadius="12px" background="#7453FD" padding="18px 20px">
      <VStack align="flex-start" spacing="10px">
        {children}
      </VStack>
    </Box>
  );
};

export const ProposalVotingWithStatus = ({
  yesPercent,
  noPercent,
  yesCount,
  noCount,
  targetPercentage,
  target,
  label,
}: Props) => {
  return (
    <>
      <ProposalProgress
        targetPercentage={targetPercentage}
        yesPercent={yesPercent}
        noPercent={noPercent}
        noCount={noCount}
        yesCount={yesCount}
        target={target}
      />
      {label && (
        <Flex pl="3" alignItems="center" w="full">
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
    </>
  );
};
