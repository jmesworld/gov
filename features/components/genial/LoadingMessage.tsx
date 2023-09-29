import { Box, Spinner } from '@chakra-ui/react';

export const LoadingComponent = () => (
  <Box
    display="flex"
    w="100vw"
    h="100vh"
    alignItems="center"
    justifyContent="center"
  >
    <Spinner color="purple" size="lg" />
  </Box>
);

export default LoadingComponent;
