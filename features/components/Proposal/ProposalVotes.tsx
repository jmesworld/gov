import { Box, Text, VStack } from '@chakra-ui/react';
import { ProposalVoter } from './ProposalVoter';

export interface ProposalVotes {
  type: string;
  percentage: number;
  votes: Vote[];
}

export interface Vote {
  voter: string;
  weight: number;
}

export const ProposalVotes = (props: ProposalVotes) => {
  const textColor =
    props.type == 'yes' ? 'rgba(161, 240, 196, 1)' : 'rgba(255, 88, 118, 1)';

  return (
    <VStack spacing="15px" width="50%">
      <VStack
        background="#5136C2"
        borderRadius="12px"
        width="100%"
        height="306px"
        padding="14px 14px 14px 22px"
        spacing="18px"
        align="flex-start"
      >
        <Text
          color={textColor}
          fontSize="16px"
          fontWeight="medium"
          fontFamily="DM Sans"
        >
          {props.votes.length} Address{props.votes.length != 1 ? 'es' : ''}
        </Text>
        <Box flexGrow={1} overflowY="scroll" width="100%">
          <VStack spacing="10px" align="flex-start">
            {props.votes.map(vote => (
              <ProposalVoter
                key={vote.voter}
                wallet={vote.voter}
                voteValue={vote.weight}
              />
            ))}
          </VStack>
        </Box>
      </VStack>
    </VStack>
  );
};
