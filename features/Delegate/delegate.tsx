import { Button, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Box, HStack, Text, Image, Flex, Tooltip, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tabs, TabList, Tab, TabPanels, TabPanel, TabIndicator } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { updateObjectBindingPattern } from "typescript";

import { DelegateUnbondingTable } from "./delegate-unbonding-table";
import { DelegateValidatorTable } from "./delegate-validator-table";
import { UnBondValidatorTable } from "./unbond-validator-table";

const validatorsData = {
  "validators": [
    {
      "name": "A Validator",
      "commission": "10",
      "votingPower": "10",
      "url": "www.google.com"
    },
    {
      "name": "C Validator",
      "commission": "7",
      "votingPower": "5",
      "url": ""
    },
    {
      "name": "F Validator",
      "commission": "50",
      "votingPower": "15",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    },
    {
      "name": "D Validator",
      "commission": "5",
      "votingPower": "10",
      "url": ""
    }
  ],
  "bondedValidators": [
    {
      "name": "A Validator",
      "bJmes": "1000",
      "url": ""
    },
    {
      "name": "C Validator",
      "bJmes": "750",
      "url": "www.google.com"
    }
  ]
}

export const Delegate = () => {
  const totalJmes = 1000;
  const totalBondedJmes = 1000;

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [bonding, setBonding] = useState(true)
  const [sliderValue, setSliderValue] = useState(50)
  const [jmesValue, setJmesValue] = useState(totalJmes/2)
  const [bJmesValue, setBJmesValue] = useState(totalJmes/2)
  const [tabIndex, setTabIndex] = useState(1)
  const [validatorSelected, setValidatorSelected] = useState(false);

  useEffect(() => {
    if(bonding) {
      // Bond
      setBJmesValue(((totalJmes / 100) * sliderValue) + totalBondedJmes);
      setJmesValue((totalJmes / 100) * (100 - sliderValue));
    } else {
      //UnBond
      setJmesValue(totalJmes + ((totalBondedJmes / 100) * sliderValue));
      setBJmesValue((totalBondedJmes / 100) * (100 - sliderValue));
    }
  }, [sliderValue, bonding]);

  const updateBonding = () => {
    setBonding(!bonding);
    setTabIndex(1);
    setValidatorSelected(false);
  }

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  return (
    <>
      <Button onClick={onOpen} border="2px solid purple" color="purple">Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(15, 0, 86, 0.6)"/>
        <ModalContent maxH="506px" maxW="892px" background="transparent" borderRadius={12} marginTop={0} top="50%" transform="translateY(-50%) !important">
          <ModalCloseButton zIndex={99} color="#fff"/>
          <ModalBody width={892} padding={0}>
            <HStack>
              <Box width={547} height={506} background="#704FF7" borderLeftRadius={12} padding="0 33px" position="relative">
                <Text
                  color="#FFFFFF"
                  fontFamily={"DM Sans"}
                  fontWeight="700"
                  fontSize={28}
                  lineHeight="39.2px"
                  marginTop="29px"
                  marginBottom="44px"
                  textAlign="center">
                    Delegation
                </Text>
                <Flex alignItems="center" justifyContent="space-between">
                  <Box>
                    <Text
                      color="#C6B4FC"
                      fontFamily={"DM Sans"}
                      fontWeight="500"
                      fontSize={12}
                      lineHeight="20px"
                      textAlign="center"
                      marginBottom="12px">
                      {bonding ? 'From' : 'To'}
                    </Text>
                    <Box width="200px" height="72px" borderRadius={12} background="#5136C2" paddingTop="9px">
                      <Text
                        color="#ffffff"
                        fontFamily={"DM Sans"}
                        fontWeight="500"
                        fontSize={11}
                        lineHeight="20px"
                        textAlign="center">
                        JMES balance
                      </Text>
                      <Text
                        color="#ffffff"
                        fontFamily={"DM Sans"}
                        fontWeight="700"
                        fontSize={28}
                        lineHeight="39.2px"
                        textAlign="center">
                        {jmesValue}
                      </Text>
                    </Box>
                  </Box>
                  <Box marginTop="34px">
                    <Tooltip label={"Click to change to " + (bonding ? 'unBond' : 'Bond')}>
                      <Flex width="50px" height="50px" borderRadius="50%" background={bonding ? '#A1F0C4' : '#C6B4FC'} justifyContent="center" alignItems="center" onClick={() => updateBonding()}>
                        <Image
                          src="/arrow.svg"
                          alt="icon"
                          width={"19px"}
                          height={"15px"}
                          transform={bonding ? 'rotate(0deg)' : 'rotate(180deg)'}
                        />
                      </Flex>
                    </Tooltip>
                  </Box>
                  <Box>
                    <Text
                      color="#C6B4FC"
                      fontFamily={"DM Sans"}
                      fontWeight="500"
                      fontSize={12}
                      lineHeight="20px"
                      textAlign="center"
                      marginBottom="12px">
                      {bonding ? 'To' : 'From'}
                    </Text>
                    <Box width="200px" height="72px" borderRadius={12} background="#5136C2" paddingTop="9px">
                      <Text
                        color="#ffffff"
                        fontFamily={"DM Sans"}
                        fontWeight="500"
                        fontSize={11}
                        lineHeight="20px"
                        textAlign="center">
                        bJMES balance
                      </Text>
                      <Text
                        color="#ffffff"
                        fontFamily={"DM Sans"}
                        fontWeight="700"
                        fontSize={28}
                        lineHeight="39.2px"
                        textAlign="center">
                        {bJmesValue}
                      </Text>
                    </Box>
                  </Box>
                </Flex>
                <Box marginTop="75px">
                  <Slider defaultValue={50} onChange={(val) => setSliderValue(val)}>
                    <SliderTrack background="#5136C2" height="16px" borderRadius="8px">
                      <SliderFilledTrack background={bonding ? '#A1F0C4' : '#C6B4FC'} />
                    </SliderTrack>
                    <SliderThumb width="20px" height="33px" background="#C6B4FC" border="2px solid" borderColor="#7453FD" boxShadow="0px 1px 1px rgba(0, 0, 0, 0.25)" position="relative" borderRadius="4px">
                      <Box width="16px" height="1px" background="#7453FD" transform="rotate(90deg)" position="relative"
                        _before={{ content: '""', position: 'absolute', top: '-4px', background: '#7453FD', width: '16px', height: '1px' }}
                        _after={{ content: '""', position: 'absolute', bottom: '-4px', background: '#7453FD', width: '16px', height: '1px' }}>
                      </Box>
                      <Box height="30px" width="55px" background="#7453FD" position="absolute" bottom="calc(100% + 15px)" left="50%" transform="translateX(-50%)" borderRadius={12} boxShadow="0px 3.5px 5.5px rgba(0, 0, 0, 0.02)"
                        _after={{ content: '""', borderTop: '15px solid #7453FD', borderLeft: '7.5px solid transparent', borderRight: '7.5px solid transparent', position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)' }}>
                        <Text
                          color="#FFFFFF"
                          fontFamily={"DM Sans"}
                          fontWeight="500"
                          fontSize={16}
                          lineHeight="15px"
                          textAlign="center"
                          marginTop="8px">
                          {sliderValue}%
                        </Text>
                      </Box>
                    </SliderThumb>
                  </Slider>
                </Box>
                <Button
                  display="block"
                  backgroundColor={bonding ? "green" : "lilac"}
                  borderRadius={90}
                  alignContent="end"
                  minWidth={"159px"}
                  width="auto"
                  height={"48px"}
                  alignSelf="center"
                  _hover={{ bg: bonding ? "green" : "lilac"} }
                  variant={"outline"}
                  borderWidth={"1px"}
                  borderColor={"rgba(0,0,0,0.1)"}
                  margin="35px auto 40px"
                  disabled={!validatorSelected}
                >
                  <Text
                    color="midnight"
                    fontFamily={"DM Sans"}
                    fontWeight="medium"
                    fontSize={14}
                  >
                    {bonding ? 'Bond' : 'UnBond'}
                    <Image
                      src="/delegate-midnight.svg"
                      display="inline-block"
                      alt="icon"
                      width={"9px"}
                      height={"10px"}
                      marginLeft="8px"
                    />
                    {bonding ? bJmesValue - totalBondedJmes : jmesValue - totalBondedJmes}
                  </Text>
                </Button>
                <Text
                  color="#C6B4FC"
                  fontFamily={"DM Sans"}
                  fontWeight="400"
                  fontSize={11}
                  lineHeight="14px"
                  textAlign="center"
                  padding="0 45px"
                  position="absolute"
                  bottom="24px"
                  left="0"
                  width="100%">
                  Bonding JMES carries the risk of slashing. This means you could lose some or all of your tokens. Do your own research and only use bonding if you understand the consequences.
                </Text>
              </Box>
              <Box width={345} height={506} marginInlineStart="0 !important" background="#5136C2" borderRightRadius={12} position="relative">
                <Tabs variant="unstyled" marginTop="41px" padding="0 30px" index={tabIndex} onChange={handleTabsChange}>
                  <TabList>
                    <Tab padding="0 0 10px" opacity={.5} _selected={{ opacity: '1' }}>
                      <Text
                        color="#ffffff"
                        fontFamily={"DM Sans"}
                        fontWeight="500"
                        fontSize={16}
                      >
                        My unbonding
                      </Text>
                    </Tab>
                    <Tab padding="0 0 10px" marginLeft="40px" opacity={.5} _selected={{ opacity: '1' }}>
                      <Text
                        color="#ffffff"
                        fontFamily={"DM Sans"}
                        fontWeight="500"
                        fontSize={16}
                      >
                        Select a validator
                      </Text>
                    </Tab>
                  </TabList>
                  <TabIndicator
                    mt="-1.5px"
                    height="2px"
                    bg="#ffffff"
                    borderRadius="1px"
                    width="80%"
                  />
                  <TabPanels>
                    <TabPanel padding={0} marginTop="30px">
                      <DelegateUnbondingTable />
                      <Text
                        color="#C6B4FC"
                        fontFamily={"DM Sans"}
                        fontWeight="400"
                        fontSize={11}
                        lineHeight="14px"
                        textAlign="center"
                        padding="0 41px"
                        position="absolute"
                        bottom="24px"
                        left="0"
                        width="100%">
                          Once unbonding bJMES is requested, it takes 21 days for them to become available as JMES again.
                      </Text>
                    </TabPanel>
                    <TabPanel padding={0}>
                    {bonding ? (
                      <DelegateValidatorTable validatorsData={validatorsData.validators} selectValidator={setValidatorSelected} />
                    ) : ( 
                      <UnBondValidatorTable validatorsData={validatorsData.bondedValidators} selectValidator={setValidatorSelected} />
                    )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
