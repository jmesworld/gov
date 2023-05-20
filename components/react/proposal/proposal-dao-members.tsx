import { Text, VStack, HStack, Tooltip, Image } from "@chakra-ui/react"
import { useEffect } from "react";

import { ProposalDaoMember } from "./proposal-dao-member";

export const ProposalDaoMembers = () => {
    useEffect(() => {
        const init = async () => {
            const percentCircle = document.querySelector('.percentCircle');
            const percent = percentCircle?.getAttribute('data-percent');
            const percentCircleLine = percentCircle?.querySelector('.fill');

            console.log('test');

            
            if(percentCircleLine && percent) {
                percentCircleLine.setAttribute('style', 'stroke-dashoffset: ' + ((100 - parseInt(percent)) / 100) * 229);
            }
        };
        init().catch(console.error);
    });

    return (
        <VStack spacing="14px" width="100%">
            <HStack width="100%">
                <Text textTransform="uppercase" color="rgba(15, 0, 86, 0.8)" fontSize={12} fontWeight="medium" fontFamily="DM Sans">DAO Members</Text>
                <Tooltip label="Info">
                    <Image
                        src='/tooltip.svg'
                        alt="Info"
                        width={"13.33px"}
                        height={"13.33px"}
                    ></Image>
                </Tooltip>
            </HStack>
            <ProposalDaoMember name="Name" percent={40} />
            <ProposalDaoMember name="Name" percent={34} />
            <ProposalDaoMember name="Name" percent={21} />
            <ProposalDaoMember name="Name" percent={75} />
            <ProposalDaoMember name="Name" percent={10} />
        </VStack>
    );
}