import { Text, Flex } from "@chakra-ui/react";

export interface ProposalVoter {
    wallet: string;
    voteValue: number;
}

export const ProposalVoter = (props: ProposalVoter) => {
    const voterText = props.wallet.slice(0, 14) + '...' + props.wallet.slice(props.wallet.length-11, props.wallet.length);

    return (
        <Flex width="100%" justifyContent="space-between">
            <Text fontSize="16px" color="#fff" fontWeight="medium" fontFamily="DM Sans">{voterText}</Text>
            <Text fontSize="16px" color="#fff" fontWeight="medium" fontFamily="DM Sans">{props.voteValue}%</Text>
        </Flex>
    );
}