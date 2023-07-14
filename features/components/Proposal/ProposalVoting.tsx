import { ReactNode } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { ProposalProgress } from './ProposalProgress';

export interface Props {
  yesPercentage: number;
  noPercentage: number;
  target: number;
  children?: ReactNode;
}

export const ProposalVoting = (props: Props) => {
  return (
    <Box borderRadius="12px" background="#7453FD" padding="18px 20px">
      <VStack align="flex-start" spacing="20px">
        {props.children}
        <ProposalProgress
          yesCount={props.yesPercentage}
          noCount={props.noPercentage}
          yesPercent={props.yesPercentage}
          noPercent={props.noPercentage}
          target={props.target}
          targetPercentage={props.target}
        />
      </VStack>
    </Box>
  );
};
