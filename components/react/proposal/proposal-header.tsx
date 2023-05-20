import { Flex, HStack, Box, Link, Text, Tooltip, Image } from "@chakra-ui/react";

export const ProposalHeader = () => {
  return (
    <Flex direction="column">
        <Text color={"#5136C2"} fontFamily="DM Sans" fontWeight="medium" fontSize={28}>
            <Link href="#" textDecoration={"underline"}>
                Crypto Castle
            </Link>
            &nbsp;&#x2022;&nbsp;
            Title of proposal
        </Text>
        <HStack marginTop="38px" marginBottom="16px">
            <Text textTransform="uppercase" color="rgba(15, 0, 86, 0.8)" fontSize={12} fontWeight="medium" fontFamily="DM Sans">Voting ends 11 March  2023 20:09 UTC</Text>
            <Tooltip label="Info">
                <Image
                    src='/tooltip.svg'
                    alt="Info"
                    width={"13.33px"}
                    height={"13.33px"}
                ></Image>
            </Tooltip>
        </HStack>
    </Flex>
  );
}