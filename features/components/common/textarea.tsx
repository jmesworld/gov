import { Textarea, TextareaProps } from '@chakra-ui/react';

export const TextareaStyled = ({ isInvalid, ...props }: TextareaProps) => {
  return (
    <Textarea
      overflow={'auto'}
      spellCheck="false"
      variant={'outline'}
      background={'background.100'}
      boxShadow="none"
      errorBorderColor="red"
      borderColor={isInvalid ? 'red' : 'background.500'}
      focusBorderColor={isInvalid ? 'red' : 'darkPurple'}
      _invalid={{
        boxShadow: 'none',
      }}
      _focus={{
        boxShadow: 'none',
      }}
      _hover={{
        borderColor: isInvalid ? 'red' : 'darkPurple',
      }}
      borderRadius={12}
      color={'purple'}
      width={'100%'}
      height={'100%'}
      fontWeight={'normal'}
      {...props}
    />
  );
};
