import { CheckIcon } from '@chakra-ui/icons';
import { Flex, Text } from '@chakra-ui/react';

export const CopiedText = ({ text }: { text: string }) => {
  return (
    <Flex alignItems="center">
      <CheckIcon color={'green'} />
      <Text ml="2" color="white">
        {text}
      </Text>
    </Flex>
  );
};
