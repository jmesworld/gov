import { Flex, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { useState } from 'react';

type Props = {
  value: [string, string];
  onchange: [(value: string) => void, (value: string) => void];
};
export const TwoInputs = ({ value, onchange }: Props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  return (
    <InputGroup
      borderColor={'primary.500'}
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
        width="35%"
        height={'100%'}
        borderColor={'primary.500'}
        background={'primary.100'}
        borderRadius={0}
        focusBorderColor="darkPurple"
        color={'purple'}
        placeholder="name"
        fontWeight={'normal'}
        value={value[0]}
        type="text"
        onChange={e => {
          onchange[0](e.target.value);
        }}
      />
      <InputRightElement display="flex" flexDir="row" height="100%" width="70%">
        <Flex
          width="33px"
          height="50%"
          bg="purple"
          marginRight="-1px"
          marginY="auto"
        />
        <Input
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          border={0}
          placeholder="Address"
          width="980%"
          height={'100%'}
          borderColor={'primary.500'}
          background={'primary.100'}
          focusBorderColor="transparent"
          borderRadius={0}
          color={'purple'}
          fontWeight={'normal'}
          value={value[1]}
          type="string"
          onChange={e => {
            onchange[1](e.target.value);
          }}
        />
      </InputRightElement>
    </InputGroup>
  );
};
