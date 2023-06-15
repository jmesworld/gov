import { Box, Center, Flex, Spacer } from "@chakra-ui/react";

const OnboardingProgressIndicator = ({
  activeCard,
}: {
  activeCard: string;
}) => {
  return (
    <Center>
      <Flex width={"88px"}>
        <OnboardingProgressIndicatorItem
          isActive={activeCard === "add-jmes-card"}
        />
        <Spacer />
        <OnboardingProgressIndicatorItem
          isActive={activeCard === "connect-wallet-card"}
        />
        <Spacer />
        <OnboardingProgressIndicatorItem
          isActive={activeCard === "add-tokens-card"}
        />
        <Spacer />
        <OnboardingProgressIndicatorItem
          isActive={activeCard === "choose-username-card"}
        />
      </Flex>
    </Center>
  );
};

const OnboardingProgressIndicatorItem = ({
  isActive,
}: {
  isActive: boolean;
}) => {
  return (
    <Box
      borderWidth={"1px"}
      borderColor={"green"}
      width={"16px"}
      height={"16px"}
      backgroundColor={isActive ? "green" : "transparent"}
      borderRadius={"full"}
    />
  );
};

export default OnboardingProgressIndicator;
