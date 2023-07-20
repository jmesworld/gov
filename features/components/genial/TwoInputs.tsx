import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';

type Props = {
  value: [string, string];
  onchange: [(value: string) => void, (value: string) => void];
  error?: string;
  isLoading?: boolean;
};
export const TwoInputs = ({ value, onchange, error, isLoading }: Props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  return (
    <InputGroup
      borderColor={error ? 'red' : 'primary.500'}
      background={'primary.100'}
      color={'purple'}
      borderRadius={12}
      borderWidth={isFocused ? 2 : 1}
      borderStyle="solid"
      variant={'outline'}
      overflow="hidden"
    >
      <Input
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        border={0}
        width="30%"
        outline="0"
        height={'100%'}
        borderColor={'primary.500'}
        background={'primary.100'}
        borderRadius={0}
        focusBorderColor="darkPurple"
        color={'purple'}
        placeholder="Name or Address"
        fontWeight={'normal'}
        value={value[0]}
        type="text"
        onChange={e => {
          const value = e.target.value;
          if (value.length > 20) {
            onchange[1](value);
            return;
          }
          onchange[0](value);
        }}
      />
      <InputRightElement display="flex" flexDir="row" height="100%" width="70%">
        <Flex
          h="full"
          w="full"
          background={'primary.100'}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Flex
            width="15px"
            height="40%"
            bg="purple"
            background="purple"
            marginY="auto"
            mr="4"
          />
          <Text
            border={0}
            width="980%"
            height={'100%'}
            background={'primary.100'}
            borderRadius={0}
            color={error ? 'red' : 'purple'}
            fontWeight={'normal'}
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            fontSize="16px"
          >
            {isLoading && 'Loading...'}
            {(!isLoading && value[1]) || error}
          </Text>
        </Flex>
      </InputRightElement>
    </InputGroup>
  );
};
