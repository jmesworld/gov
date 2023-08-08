import { ToastId, UseToastOptions } from '@chakra-ui/react';

export const handleError = (
  error: unknown,
  title: string,
  toast: (options?: UseToastOptions | undefined) => ToastId,
) => {
  console.error(error);
  let message = 'Something went wrong.';
  if (error instanceof Error) {
    message = error.message;
  }
  toast({
    title,
    description: message,
    status: 'error',
    duration: 5000,
    isClosable: true,
  });
};
