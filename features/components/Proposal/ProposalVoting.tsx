import { ReactNode } from 'react';
import { Badge, Box, Flex } from '@chakra-ui/react';
import { ProposalProgress } from './ProposalProgress';

export interface Props {
  yesPercentage: number;
  noPercentage: number;
  target: number;
  children?: ReactNode;
  childrenAtTheBottom?: ReactNode;
  label?: {
    label: string;
    success: boolean;
  };
}

export const ProposalVoting = ({
  children,
  childrenAtTheBottom,
  yesPercentage,
  noPercentage,
  target,
  label,
}: Props) => {
  return (
    <Box borderRadius="12px" background="#7453FD" padding="18px 20px">
      <Flex flexDir="column" align="flex-start">
        {children}
        <ProposalProgress
          yesCount={yesPercentage}
          noCount={noPercentage}
          yesPercent={yesPercentage}
          noPercent={noPercentage}
          target={target}
          targetPercentage={target}
        />
        {label && (
          <Badge
            rounded="full"
            px="2"
            fontWeight="normal"
            mt="10px"
            ml="10px"
            bg={label.success ? 'green' : 'red'}
          >
            {label.label}
          </Badge>
        )}
        {childrenAtTheBottom}
      </Flex>
    </Box>
  );
};
