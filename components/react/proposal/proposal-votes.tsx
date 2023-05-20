import { Box, Text, VStack } from "@chakra-ui/react";
import { ProposalVoter } from "./proposal-voter";

export interface ProposalVotes {
    type: string;
    percentage: number;
    voters: Voter[];
}

export interface Voter {
    wallet: string;
    voteValue: number;
}

export const ProposalVotes = (props: ProposalVotes) => {
    const textColor = props.type == 'yes' ? 'rgba(161, 240, 196, 1)' : 'rgba(255, 88, 118, 1)';
    const votesText = props.voters.length + (props.voters.length == 0 || props.voters.length > 1 ? ' votes' : ' vote');
    const percentageText = props.percentage.toFixed(2) + '%';

    return (
        <VStack spacing="15px" flexGrow={1}>
            <Box background="#5136C2" borderRadius="12px" padding="20px" width="100%">
                <Text fontSize="24px" fontWeight="normal" marginBottom="12px" color={textColor} fontFamily="DM Sans">{percentageText}</Text>
                <Text color="rgba(255, 255, 255, 0.7)" fontSize="14px" fontWeight="normal" fontFamily="DM Sans"><Box width="9px" height="9px" background={textColor} display="inline-block" marginRight="6px" borderRadius="50%" />{votesText}</Text>
            </Box>
            <VStack background="#5136C2" borderRadius="12px" width="100%" height="306px" padding="14px 14px 14px 22px" spacing="18px" align="flex-start">
                <Text color={textColor} fontSize="16px" fontWeight="medium" fontFamily="DM Sans">7 Addresses</Text>
                <Box flexGrow={1} overflowY="scroll" width="100%">
                    <VStack spacing="10px" align="flex-start">
                        {props.voters.map((voter)=>
                            <ProposalVoter key={voter.wallet} wallet={voter.wallet} voteValue={voter.voteValue} />
                        )}
                    </VStack>
                </Box>
            </VStack>
        </VStack>
    );
}