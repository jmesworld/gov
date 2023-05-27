import { Box, Text, VStack } from "@chakra-ui/react";
import { ProposalVoter } from "./proposal-voter";

export interface ProposalVotes {
  type: string;
  percentage: number;
  votes: Vote[];
}

export interface Vote {
  voter: string;
  weight: number;
}

export const ProposalVotes = (props: ProposalVotes) => {
  const textColor =
    props.type == "yes" ? "rgba(161, 240, 196, 1)" : "rgba(255, 88, 118, 1)";
  const votesText =
    props.votes.length +
    (props.votes.length == 0 || props.votes.length > 1 ? " votes" : " vote");
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
      <VStack
        background="#5136C2"
        borderRadius="12px"
        width="100%"
        height="306px"
        padding="14px 14px 14px 22px"
        spacing="18px"
        align="flex-start"
      >
        <Text
          color={textColor}
          fontSize="16px"
          fontWeight="medium"
          fontFamily="DM Sans"
        >
          {props.votes.length} Address{props.votes.length != 1 ? "es" : ""}
        </Text>
        <Box flexGrow={1} overflowY="scroll" width="100%">
          <VStack spacing="10px" align="flex-start">
            {props.votes.map((vote) => (
              <ProposalVoter
                key={vote.voter}
                wallet={vote.voter}
                voteValue={vote.weight}
              />
            ))}
          </VStack>
        </Box>
      </VStack>
    </VStack>
  );
};
