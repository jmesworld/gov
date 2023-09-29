import { Alert, AlertDescription, AlertTitle, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};
export const ErrorAlert = ({ title, description, children }: Props) => {
  return (
    <Flex h="full" my="auto" mx="auto" maxW="sm">
      <Alert
        my="2"
        sx={{
          display: 'flex',
          flexDir: 'column',
          gap: 4,
        }}
        status="error"
      >
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        <Flex>{children}</Flex>
      </Alert>
    </Flex>
  );
};
