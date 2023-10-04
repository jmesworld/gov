import { Button, Text } from '@chakra-ui/react';

type Props = {
  enabled: boolean;

  loading: boolean;

  nextPage: () => void;
};
export const LoadMore = ({
  enabled,

  nextPage,
  loading,
}: Props) => {
  if (!enabled) return null;

  return (
    <Button
      isLoading={loading}
      variant="solid"
      color="purple"
      onClick={() => {
        nextPage();
      }}
      loadingText="Loading..."
      ml={2}
      mr={2}
      mb={4}
    >
      <Text>Load more</Text>
    </Button>
  );
};
