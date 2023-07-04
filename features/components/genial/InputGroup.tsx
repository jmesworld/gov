import {
  InputGroup as ChakraInputGroup,
  InputGroupProps,
} from '@chakra-ui/react';

type Props = InputGroupProps;
export const InputGroup = (props: Props) => {
  return <ChakraInputGroup as="input" {...props} />;
};
