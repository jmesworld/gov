import { Box, Center, Flex, Image } from '@chakra-ui/react';

const OnboardingProgressIndicator = ({
  activeCard,
}: {
  activeCard: string;
}) => {
  return (
    <Center>
      <Flex width={'88px'} alignItems="center">
        <OnboardingProgressIndicatorItem
          checked={activeCard === 'choose-username-card'}
          isActive={activeCard === 'add-tokens-card'}
        />
        <Flex width={33} height="1px" bg="green" />
        <OnboardingProgressIndicatorItem
          isActive={activeCard === 'choose-username-card'}
        />
      </Flex>
    </Center>
  );
};

const OnboardingProgressIndicatorItem = ({
  isActive,
  checked,
}: {
  checked?: boolean;
  isActive: boolean;
}) => {
  return (
    <Box
      borderWidth="1px"
      borderColor="green"
      width="16px"
      height="16px"
      backgroundColor={isActive || checked ? 'green' : 'transparent'}
      borderRadius="full"
      position="relative"
    >
      {checked && (
        <Image
          position="absolute"
          margin="auto"
          top="0"
          bottom="0"
          right="0"
          left="0"
          src="/CheckFilled.svg"
          alt="checked"
        />
      )}
    </Box>
  );
};

export default OnboardingProgressIndicator;
