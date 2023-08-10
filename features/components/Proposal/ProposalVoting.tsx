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
    success: boolean | null;
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
  const getBG = (success: boolean | null) => {
    if (success === null) {
      return 'yellow';
    }
    if (success) {
      return 'green';
    }
    return 'red';
  };

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
            bg={getBG(label.success)}
          >
            {label.label}
          </Badge>
        )}
        {childrenAtTheBottom}
      </Flex>
    </Box>
  );
};
