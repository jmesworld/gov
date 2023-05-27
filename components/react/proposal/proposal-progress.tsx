import { Box, Flex, HStack, Text } from "@chakra-ui/react";

interface ProposalProgress {
  progress: number;
  target: number
}

export const ProposalProgress = (props: ProposalProgress) => {
  const progress = props.progress.toFixed(2) + '%';
  const target = props.target.toFixed(2) + '%';
  const targetText = props.target + '%';

  return (
    <Box width="100%">
      <Box width="100%" background="#5136C2" borderRadius="15px" position="relative">
        <Box height="15px" background="#A1F0C4" width={progress} borderLeftRadius="15px"></Box>
        <Box position="absolute" left={target} bottom="0" marginLeft="-5px">
            <Box width="11px" height="15px" background="#7453FD">
              <Box width="3px" height="15px" marginLeft="4px" background="#fff"></Box>
            </Box>
            <Text color="#fff" fontSize="14px" fontWeight="normal" position="absolute" bottom="18px" marginLeft="5px" fontFamily="DM Sans">{targetText}</Text>
        </Box>
      </Box>
      <Flex width="100%" justifyContent="space-between" marginTop="8px">
          <Text color="#fff" fontSize="12px" fontWeight="normal" fontFamily="DM Sans">0%</Text>
          <Text color="#fff" fontSize="12px" fontWeight="normal" fontFamily="DM Sans">100%</Text>
      </Flex>
    </Box>
  );
}