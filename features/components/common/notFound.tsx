import {
  Alert,
  AlertDescription,
  AlertTitle,
  Divider,
  Flex,
} from '@chakra-ui/react';

type Props = {
  title: string;
  description?: string;
};
export const NotFound = ({ title, description }: Props) => {
  return (
    <Flex w="full" h="full" alignItems="center" justifyContent="center">
      <Alert
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        rounded="xl"
        w="400px"
        py="4"
        status="error"
        variant="custom"
      >
        <AlertTitle fontSize="xl" textAlign="center" w="full">
          {title}
        </AlertTitle>
        <Divider my="2" w="full" h="1px" bg="gray.400" />
        <AlertDescription textAlign="center" w="full">
          {description}
        </AlertDescription>
      </Alert>
    </Flex>
  );
};
