import { Flex, Text } from '@chakra-ui/react';
import { MouseEventHandler } from 'react';
type Props = {
  inActive?: boolean;
  text: string;
  isSelected: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
};

export const NavBarItem = ({ text, isSelected, onClick, inActive }: Props) => {
  return (
    <Flex
      opacity={inActive ? 0.5 : 1}
      width="full"
      onClick={onClick}
      cursor={'pointer'}
    >
      <Flex
        py="8px"
        width={'100%'}
        height={'100%'}
        backgroundColor={isSelected ? '#5136C2' : '#7453FD'}
      >
        <Text
          noOfLines={1}
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
