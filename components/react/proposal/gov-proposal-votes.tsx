import { Box, Text, VStack } from "@chakra-ui/react";
import { ProposalVoter } from "./proposal-voter";

export interface GovProposalVotes {
  type: string;
  percentage: number;
  votes: number;
}

export const GovProposalVotes = (props: GovProposalVotes) => {
  const textColor =
    props.type == "yes" ? "rgba(161, 240, 196, 1)" : "rgba(255, 88, 118, 1)";
  const votesText = props.votes !== 1 ? " votes" : " vote";
  const percentageText = props.percentage.toFixed(2) + "%";

  return (
    <VStack spacing="15px" flexGrow={1}>
      <Box background="#5136C2" borderRadius="12px" padding="20px" width="100%">
        <Text
          fontSize="24px"
          fontWeight="normal"
          marginBottom="12px"
          color={textColor}
          fontFamily="DM Sans"
        >
          {percentageText}
        </Text>
        <Text
          color="rgba(255, 255, 255, 0.7)"
          fontSize="14px"
          fontWeight="normal"
          fontFamily="DM Sans"
        >
          <Box
            width="9px"
            height="9px"
            background={textColor}
            display="inline-block"
            marginRight="6px"
            borderRadius="50%"
          />
          {votesText}
        </Text>
      </Box>
    </VStack>
  );
};
