import { Flex, Text } from '@chakra-ui/react';
import { MouseEventHandler } from 'react';

export const NavBarItem = ({
  text,
  isSelected,
  onClick,
}: {
  text: string;
  isSelected: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <Flex width={'200px'} onClick={onClick} cursor={'pointer'}>
      <Flex
        py="8px"
        width={'100%'}
        height={'100%'}
        backgroundColor={isSelected ? '#5136C2' : '#7453FD'}
      >
        <Text
          color="white"
          fontFamily={'DM Sans'}
          fontWeight="medium"
          fontSize={14}
          alignSelf={'center'}
          marginLeft={'25px'}
        >
          {text}
        </Text>
      </Flex>
    </Flex>
  );
};
