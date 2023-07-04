import { useState, useEffect } from 'react';
import { useBreakpointValue, Box, Text } from '@chakra-ui/react';

const MobileViewDisabled = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500); // Adjust the delay time as needed

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const isMobileView = useBreakpointValue({ base: true, md: false });

  if (!isReady || !isMobileView) {
    return null; // Render nothing until the component is ready or not in mobile view
  }

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
