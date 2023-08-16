import {
  useToast as ChakraUIUseToast,
  UseToastOptions,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
} from '@chakra-ui/react';

export const useToast = (options?: UseToastOptions) => {
  return ChakraUIUseToast({
    ...(options || {}),
    render: ({
      id,
      title,
      description,
      variant,
      status,
      isClosable,
      onClose,
    }) => {
      return (
        <Alert
          minWidth={'200px'}
          width="fit-content"
          key={id}
          rounded="lg"
          variant={variant}
          status={status}
        >
          <AlertIcon />
          <Box minWidth={'100px'} width={'auto'}>
            <AlertTitle>{title}</AlertTitle>
            {description && <AlertDescription>{description}</AlertDescription>}
          </Box>

          {isClosable && (
            <CloseButton
              alignSelf="flex-start"
              position="relative"
              right={-1}
              top={-1}
              onClick={onClose}
            />
          )}
        </Alert>
      );
    },
  });
};
