import { Box, Text, ButtonGroup, Button } from "@chakra-ui/react"

export const ProposalMyVote = () => {
    return (
        <Box borderRadius="12px" backgroundColor="#7453FD" padding="14px 16px" width="100%">
            <Text color="#fff" fontSize={16} fontWeight="medium" fontFamily="DM Sans">My Voting Power</Text>
            <Text fontSize="24px" fontWeight="normal" marginBottom="12px" color="#fff" margin="20px 0 0" fontFamily="DM Sans">25.00%</Text>
            <ButtonGroup gap="6px" width="100%" marginTop="40px">
                <Box
                    as="button"
                    height="42px"
                    width="50%"
                    lineHeight="16px"
                    border="1px"
                    borderRadius="90px"
                    fontSize="14px"
                    fontWeight="medium"
                    bg="#A1F0C4"
                    borderColor="#91D8B0"
                    color="#0F0056"
                    fontFamily="DM Sans"
                    >
                    Yes
                </Box>
                <Box
                    as="button"
                    height="42px"
                    width="50%"
                    lineHeight="16px"
                    border="1px"
                    borderRadius="90px"
                    fontSize="14px"
                    fontWeight="medium"
                    bg="#FF5876"
                    borderColor="#E54F6A"
                    color="#fff"
                    fontFamily="DM Sans"
                    >
                    No
                </Box>
            </ButtonGroup>
        </Box>
    );
}