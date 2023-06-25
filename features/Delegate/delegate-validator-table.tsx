import { Text, Box, Image } from "@chakra-ui/react";
import { useState } from "react";

interface ValidatorProps {
    validatorsData: Object;
    selectValidator: Function;
}

export const DelegateValidatorTable = ({validatorsData, selectValidator}: ValidatorProps) => {
    const [activeIndex, setActiveIndex] = useState<number | null>();

    validatorsData  = Object.values(validatorsData);

    function setSelectedValidator(idx: number){
        if(idx == activeIndex) {
            setActiveIndex(null);
            selectValidator(false);
        } else {
            setActiveIndex(idx);
            selectValidator(true);
        }
    };

    return (
        <Box position="relative" height="380px" overflowY="scroll">
            <Text
            color="#fff"
            fontFamily={"DM Sans"}
            fontWeight="500"
            fontSize={12}
            margin="40px 0 10px">
                Select a validator to bond to
            </Text>
            <Box display="flex" justifyContent="flex-start" padding="8px 0" position="sticky" top="0" background="#5136C2" zIndex="99">
                <Text
                color="lilac"
                fontFamily={"DM Sans"}
                fontWeight="500"
                fontSize={12}
                lineHeight="20px"
                width="36%">
                    Name
                </Text>
                <Text
                color="lilac"
                fontFamily={"DM Sans"}
                fontWeight="500"
                fontSize={12}
                lineHeight="20px"
                width="30%">
                    Commission
                </Text>
                <Text
                color="lilac"
                fontFamily={"DM Sans"}
                fontWeight="500"
                fontSize={12}
                lineHeight="20px"
                width="30%">
                    Voting Power
                </Text>
            </Box>

            {validatorsData.map((validator, i) => (
                <Box 
                key={validator.name.toLowerCase().replace(/\s/g, '') + '-' + i} 
                onClick={() => setSelectedValidator(i)}
                display="flex" 
                justifyContent="flex-start"
                padding={activeIndex === i ? "8px" : "8px 0"}
                background={activeIndex === i ? "#704FF7" : ""}
                borderRadius={activeIndex === i ? "4px" : ""}
                cursor="pointer">
                    <Text
                    color="#fff"
                    fontFamily={"DM Sans"}
                    fontWeight="500"
                    fontSize={12}
                    lineHeight="20px"
                    width="36%">
                        {validator.name}
                    </Text>
                    <Text
                    color="#fff"
                    fontFamily={"DM Sans"}
                    fontWeight="500"
                    fontSize={12}
                    lineHeight="20px"
                    width="30%">
                        {validator.commission}%
                    </Text>
                    <Text
                    color="#fff"
                    fontFamily={"DM Sans"}
                    fontWeight="500"
                    fontSize={12}
                    lineHeight="20px"
                    width="30%">
                        {validator.votingPower}%
                    </Text>
                    {validator.url && (
                        <Box width="4%">
                            <a href={validator.url} target="_blank">
                                <Image
                                    src='/link.svg'
                                    alt="external link"
                                    width={"12px"}
                                    height={"12px"}
                                    margin="3px 0"
                                />
                            </a>
                        </Box>
                    )}
                </Box>
            ))}
        </Box>
    );
};
