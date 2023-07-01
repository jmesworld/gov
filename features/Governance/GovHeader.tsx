import { Box, Flex, Text } from '@chakra-ui/react';

const GovHeader = () => {
  return (
    <Box>
      <Text
        color={'midnight'}
        fontWeight="bold"
        fontFamily="DM Sans"
        fontSize={20}
      >
        Welcome to
      </Text>
      <Text
        color={'purple'}
        fontWeight="normal"
        fontFamily="DM Sans"
        fontSize={38}
      >
        JMES Governance
      </Text>
    </Box>
  );
};

export default GovHeader;
