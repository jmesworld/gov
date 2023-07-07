import { Box, Spinner, Text } from '@chakra-ui/react';

interface LoadingComponentProps {
  message?: string;
}

export const LoadingComponent = ({ message }: LoadingComponentProps) => (
  <Box display="flex" alignItems="center" justifyContent="flex-start">
    <Spinner color="purple" size="sm" />
    {message && (
      <Text ml={4} color="gray.600">
        {message}
      </Text>
    )}
  </Box>
);

export default LoadingComponent;
