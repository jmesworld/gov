import { Box, Spinner } from '@chakra-ui/react';

export const LoadingComponent = () => (
  <Box
    display="flex"
    w="full"
    h="full"
    alignItems="center"
    justifyContent="center"
  >
    <Spinner color="purple" size="lg" />
  </Box>
);

export default LoadingComponent;
