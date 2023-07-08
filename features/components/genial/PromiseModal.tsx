import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  Button,
  Image,
  Text,
} from '@chakra-ui/react';
import { create } from 'react-modal-promise';

type Props = {
  isOpen: boolean;
  title: string;
  description: string;
  onResolve: () => void;
  onReject: () => void;
};
const ModalElement = ({
  isOpen,
  onResolve,
  onReject,
  title,
  description,
}: Props) => {
  return (
    <Modal
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered
      size="sm"
      isOpen={isOpen}
      onCloseComplete={onReject}
      onClose={onReject}
    >
      <ModalOverlay bg="rgba(0,0,0,0)" />
      <ModalContent
        width="375px"
        borderRadius={40}
        bg="white"
        px="29px"
        py="20px"
      >
        <Image
          alignSelf="center"
          src="/alert-triangle.svg"
          alt="warning icon"
          width={'57px'}
          height={'59px'}
        />
        <Text fontSize="md" px="20px" textAlign="center" mt="4">
          {title}
        </Text>
        <Text fontSize="md" px="20px" mb="1" textAlign="center" mt="5">
          {description}
        </Text>
        <ModalFooter w="full" px="0" display="flex">
          <Button
            size="lg"
            w="full"
            rounded="full"
            py={4}
            variant="outline"
            colorScheme="purple"
            onClick={onReject}
          >
            No
          </Button>
          <Button
            _hover={{
              bg: 'purple.400',
            }}
            rounded="full"
            size="lg"
            w="full"
            borderColor="purple"
            variant="solid"
            bg="purple"
            py="4"
            textColor="white"
            ml={3}
            onClick={onResolve}
          >
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PromiseModal = create<any, Props>(ModalElement);
