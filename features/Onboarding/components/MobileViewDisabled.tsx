import { Box, Text } from '@chakra-ui/react';

const MobileViewDisabled = () => {
  return (
    <Box
      p={4}
      bg="lilac"
      color="purple"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="md">
        Please use the web view for the best experience.
      </Text>
    </Box>
  );
};

export default MobileViewDisabled;
