import { Box, Text } from "@chakra-ui/react"
import { useEffect, useRef } from "react";

interface ProposalDaoMember {
    name: string;
    percent: number;
}

export const ProposalDaoMember = (props: ProposalDaoMember) => {
    const percentageRef = useRef<HTMLElement>();

    useEffect(() => {
        const init = async () => {
            const percentCircle = percentageRef.current;
            const percent = percentCircle?.getAttribute('data-percent');
            const percentCircleLine = percentCircle?.querySelector('.fill');
            
            if(percentCircleLine && percent) {
                percentCircleLine.setAttribute('style', 'stroke-dashoffset: ' + ((100 - parseInt(percent)) / 100) * 229);
            }
        };
        init().catch(console.error);
    });

    return (
        <Box borderRadius="90px" backgroundColor="#fff" padding="10px 26px" width="100%" position="relative" borderWidth="1px" borderColor="rgba(116, 83, 253, 0.3)">
            <Text color="#7453FD" fontFamily="DM Sans">{props.name}</Text>
            <Box position="absolute" top="50%" right="-1px" transform="translateY(-50%)" borderRadius="50%" width="54px" height="54px" backgroundColor="#fff" borderWidth="1px" borderColor="rgba(116, 83, 253, 0.3)">
                <Text fontSize="14px" fontWeight="medium" color="rgba(0, 0, 0, 0.7)" position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">{props.percent}%</Text>
                <svg className="percentCircle" data-percent={props.percent} x="0px" y="0px" viewBox="0 0 80 80" >
                    <path className="track" d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0" fill="rgba(0,0,0,0)" strokeWidth={3} stroke="rgba(0,0,0,0.1)" />
                    <path className="fill" d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0" fill="rgba(0,0,0,0)" strokeWidth={3} stroke="#4FD1C5" strokeDasharray={219} strokeDashoffset="219px" />
                </svg>
            </Box>
        </Box>
    );
}