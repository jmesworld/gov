import { Button, Divider, Flex } from '@chakra-ui/react';

type Props = {
  onClose: () => void;
};
export const ClosePageButton = ({ onClose }: Props) => {
  return (
    <Flex
      mb="25px"
      gap="4"
      alignItems="flex-end"
      justifyContent="center"
      flexDir="column"
      bottom={0}
      pos="relative"
      w="full"
    >
      <Divider height="1px" bg="purple" w="full" />
      <div>
        <Button
          rounded="full"
          colorScheme="purple"
          onClick={onClose}
          appearance="button"
          variant="outline"
          fontWeight="normal"
          px="40px"
          py="23px"
          borderColor="purple"
        >
          Close
        </Button>
      </div>
    </Flex>
  );
};
