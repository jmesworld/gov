import { Button, Flex, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

type Props = {
  enabled: boolean;
  nextPage: boolean;
  prevPage: boolean;
  page: number;
  onPage: (page: number) => void;
};
export const SimplePagination = ({
  enabled,
  page,
  nextPage,
  prevPage,
  onPage,
}: Props) => {
  if (!enabled) return null;

  return (
    <Flex alignItems="center">
      <Button
        isDisabled={!prevPage}
        onClick={() => {
          onPage(page - 1);
        }}
        size="sm"
        listStyleType="none"
        ml={2}
        mr={2}
        display="inline-block"
      >
        <ChevronLeftIcon />
      </Button>
      <Text>{page}</Text>
      <Button
        isDisabled={!nextPage}
        onClick={() => {
          onPage(page + 1);
        }}
        size="sm"
        listStyleType="none"
        ml={2}
        mr={2}
        display="inline-block"
      >
        <ChevronRightIcon />
      </Button>
    </Flex>
  );
};
