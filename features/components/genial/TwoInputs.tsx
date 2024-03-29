import {
  Flex,
  InputGroup,
  InputRightElement,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { InputStyled } from '../common/Input';

type Props = {
  value: [string, string];
  onchange?: [(value: string) => void, (value: string) => void];
  error?: string;
  isLoading?: boolean;
};
export const TwoInputs = ({ value, onchange, error, isLoading }: Props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  return (
    <InputGroup
      background={'background.100'}
      color={'purple'}
      borderRadius={12}
      borderWidth={isFocused ? 1 : 1}
      borderStyle="solid"
      variant={'outline'}
      overflow="hidden"
      display="flex"
      alignItems="center"
      borderColor={error ? 'red' : isFocused ? 'darkPurple' : 'background.500'}
    >
      {value[0] === value[1] && value.join('') !== '' && (
        <Tag
          ml="4"
          px="4"
          height="33px"
          size="md"
          borderRadius="full"
          bg="purple"
          color="white"
        >
          <TagLabel> Address </TagLabel>
          <TagCloseButton
            onClick={() => {
              onchange?.[1]('');
            }}
            color={'white'}
          />
        </Tag>
      )}
      {(value[0] !== value[1] || value.join('') === '') && (
        <InputStyled
          isReadOnly={!onchange?.[0]}
          onMouseEnter={() => {
            setIsFocused(true);
          }}
          onMouseLeave={() => {
            setIsFocused(false);
          }}
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
          borderRadius={0}
          placeholder="Name or Address"
          value={value[0]}
          type="text"
          onChange={e => {
            const value = e.target.value;
            if (value.length > 20) {
              onchange?.[1](value);
              return;
            }
            onchange?.[0](value);
          }}
        />
      )}
      <InputRightElement display="flex" flexDir="row" height="100%" width="70%">
        <Flex
          h="full"
          w="full"
          background={'background.100'}
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
            background={'background.100'}
            borderRadius={0}
            color={'purple'}
            fontWeight={'normal'}
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            fontSize="16px"
            noOfLines={1}
            whiteSpace="pre-wrap"
            wordBreak="break-all"
          >
            {isLoading && 'Loading...'}
            {(!isLoading && error) || (!isLoading && value[1])}
          </Text>
        </Flex>
      </InputRightElement>
    </InputGroup>
  );
};
