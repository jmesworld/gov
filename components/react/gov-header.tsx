import { Box, Flex, Text } from "@chakra-ui/react";

export const GovHeader = () => {
  return (
    <Box>
      <Text
        color={"midnight"}
        fontWeight="bold"
        fontFamily="DM Sans"
        fontSize={16}
      >
        Welcome to
      </Text>
      <Text
        color={"purple"}
        fontWeight="normal"
        fontFamily="DM Sans"
        fontSize={48}
      >
        JMES Governance
      </Text>
    </Box>
  );
};
