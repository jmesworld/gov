import { useBreakpointValue, Box, Text } from "@chakra-ui/react";

const MobileViewDisabled = () => {
  const isMobileView = useBreakpointValue({ base: true, md: false });

  if (!isMobileView) {
    return null; // Render nothing if not in mobile view
  }

  return (
    <Box
      p={4}
      bg="lilac"
      color="purple"
      height={"100vh"}
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
