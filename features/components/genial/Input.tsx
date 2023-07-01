import { Input as ChakraInput, InputProps } from '@chakra-ui/react';

type Props = InputProps;
export const Input = (props: Props) => {
  return <ChakraInput as="input" {...props} />;
};
