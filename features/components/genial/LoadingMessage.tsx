import { Box, Spinner, Text } from '@chakra-ui/react';

interface LoadingComponentProps {
  message?: string;
}

export const LoadingComponent = ({ message }: LoadingComponentProps) => (
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
