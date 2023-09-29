import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Box,
  HStack,
  Text,
  Image,
  Flex,
  Tooltip,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TabIndicator,
  Spinner,
  Input,
} from '@chakra-ui/react';
import { useMemo, useState, ChangeEvent } from 'react';
import { DelegateUnbondingTable } from './delegate-unbonding-table';
import { DelegateValidatorTable } from './delegate-validator-table';
// import { validatorsData } from './mock/validator';
import { useDelegate } from './hooks/useDelegate';
import { UnBondValidatorTable } from './unbond-validator-table';
import { useIdentityContext } from '../../contexts/IdentityContext';
import { numberWithDecimals } from '../../utils/numberValidators';
import { formatBalanceWithComma } from '../../hooks/useAccountBalance';
import { NumericFormat } from 'react-number-format';

type Props = {
  onClose: () => void;
};

export const Delegate = ({ onClose }: Props) => {
  const { address } = useIdentityContext();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const {
    toggleBonding,
    onChangeSlider,
    validatorsMap,
    sliderValue,
    bonding,
    totalBondedJmes,
    totalJmes,
    jmesValue,
    selectedValidator,
    validatorList,
    isValidatorsLoading,
    setBondingState,
    valueToMove,
    isMovingNotValid,
    delegateTokens,
    delegatingToken,
    selectedUnBonding,
    bondedValidators,
    isBondedValidatorsLoading,
    validatorsError,
    bondedValidatorsError,
    unBondingsData,
    unBondingsError,
    isLoadingUnBondings,
    onValueChange,
  } = useDelegate();
  const balanceWhenMoved = useMemo(() => {
    const balance = bonding
      ? totalJmes - (valueToMove || 0)
      : totalJmes + (valueToMove || 0);
    if (balance > 0) {
      return balance;
    }
    return 0;
  }, [bonding, totalJmes, valueToMove]);
  const numberValueToMove = Number(valueToMove) || 0;
  const delegateButtonEnabled = useMemo(() => {
    const selected = bonding ? selectedValidator : selectedUnBonding;
    return selected && !isMovingNotValid && !delegatingToken;
  }, [
    bonding,
    delegatingToken,
    isMovingNotValid,
    selectedUnBonding,
    selectedValidator,
  ]);
  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };
  if (!address) {
    onClose();
    return null;
  }
  const onValueToMoveChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (numberWithDecimals(6).safeParse(value).success) {
      onValueChange(value);
    }
    if (value === '') {
      onValueChange('');
    }
  };

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={true} onClose={onClose}>
        <ModalOverlay bg="rgba(15, 0, 86, 0.6)" />
        <ModalContent
          maxH="506px"
          maxW="892px"
          background="transparent"
          borderRadius={12}
          marginTop={0}
          top="50%"
          transform="translateY(-50%) !important"
        >
          <ModalCloseButton zIndex={99} color="white" />
          <ModalBody width={892} padding={0}>
            <HStack>
              <Box
                width={547}
                height={506}
                background="#704FF7"
                borderLeftRadius={12}
                padding="0 33px"
                position="relative"
              >
                <Text
                  color="white"
                  fontFamily={'DM Sans'}
                  fontWeight="700"
                  fontSize={28}
                  lineHeight="39.2px"
                  marginTop="29px"
                  marginBottom="29px"
                  textAlign="center"
                >
                  Delegation
                </Text>
                <Flex alignItems="flex-start" justifyContent="space-between">
                  <Box>
                    <Text
                      color="lilac"
                      fontFamily={'DM Sans'}
                      fontWeight="500"
                      fontSize={12}
                      lineHeight="20px"
                      textAlign="center"
                      marginBottom="12px"
                    >
                      {bonding ? 'from' : 'to'}
                    </Text>
                    <Box
                      width="200px"
                      height="72px"
                      borderRadius={12}
                      background="darkPurple"
                      paddingTop="9px"
                      mx="auto"
                      pb="2"
                      display="flex"
                      flexDir="column"
                      justifyContent="center"
                      alignContent="center"
                    >
                      <Text
                        color="white"
                        fontFamily={'DM Sans'}
                        fontWeight="500"
                        fontSize={11}
                        lineHeight="20px"
                        textAlign="center"
                      >
                        JMES balance
                      </Text>
                      <Input
                        readOnly
                        bg="transparent"
                        color="white"
                        value={formatBalanceWithComma(balanceWhenMoved, 0)}
                        fontFamily={'DM Sans'}
                        fontWeight="700"
                        fontSize={28}
                        mx="auto"
                        width={'90%'}
                        border={0}
                        lineHeight="39.2px"
                        textAlign="center"
                      />
                    </Box>
                    <Text
                      color="red"
                      fontFamily={'DM Sans'}
                      fontWeight="500"
                      fontSize={12}
                      lineHeight="20px"
                      mt={1}
                      textAlign="center"
                    >
                      {bonding && jmesValue < 0 ? 'Not enough Balance' : ''}
                      {!bonding && totalJmes + totalBondedJmes < jmesValue
                        ? 'Not enough bJMES'
                        : ''}
                    </Text>
                  </Box>
                  <Box marginTop="44px">
                    <Tooltip
                      hasArrow
                      label={
                        'Click to change to ' + (bonding ? 'Unbond' : 'Bond')
                      }
                    >
                      <Flex
                        width="50px"
                        height="50px"
                        borderRadius="50%"
                        background={bonding ? 'green' : 'lilac'}
                        justifyContent="center"
                        alignItems="center"
                        onClick={() => {
                          toggleBonding();
                          setTabIndex(0);
                        }}
                      >
                        <Image
                          src="/arrow.svg"
                          alt="icon"
                          width={'19px'}
                          height={'15px'}
                          transition={'.2s all'}
                          transform={
                            bonding ? 'rotate(0deg)' : 'rotate(180deg)'
                          }
                        />
                      </Flex>
                    </Tooltip>
                  </Box>
                  <Box>
                    <Text
                      color="lilac"
                      fontFamily={'DM Sans'}
                      fontWeight="500"
                      fontSize={12}
                      lineHeight="20px"
                      textAlign="center"
                      marginBottom="12px"
                    >
                      {bonding ? 'to' : 'from'}
                    </Text>

                    <Box
                      width="200px"
                      height="72px"
                      borderRadius={12}
                      background="darkPurple"
                      paddingY="9px"
                      flexDir="column"
                      pb="2"
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                    >
                      <Text
                        color="white"
                        fontFamily={'DM Sans'}
                        fontWeight="500"
                        fontSize={11}
                        lineHeight="20px"
                        textAlign="center"
                      >
                        {bonding ? 'JMES to Bond' : 'bJMES to unbond'}
                      </Text>
                      <NumericFormat
                        decimalScale={6}
                        thousandSeparator
                        customInput={Input}
                        isInvalid={
                          bonding
                            ? numberValueToMove > totalJmes
                            : numberValueToMove > totalBondedJmes
                        }
                        errorBorderColor="red"
                        onChange={onValueToMoveChange}
                        bg="transparent"
                        color="white"
                        value={valueToMove}
                        fontFamily={'DM Sans'}
                        fontWeight="700"
                        fontSize={28}
                        mx="auto"
                        width="90%"
                        border={0}
                        lineHeight="39.2px"
                        textAlign="center"
                      />
                    </Box>
                    <Text
                      color="lilac"
                      fontFamily={'DM Sans'}
                      fontWeight="500"
                      fontSize={12}
                      lineHeight="20px"
                      mt={1}
                      textAlign="center"
                      marginBottom="12px"
                    >
                      {bonding && `Total JMES: ${Math.max(0, totalJmes - 1)}`}
                      {!bonding &&
                        `Total bJMES: ${Math.max(0, totalBondedJmes)}`}
                      <Button
                        size="xs"
                        ml="1"
                        color="purple"
                        onClick={e => {
                          if (bonding) {
                            onValueChange(String(Math.max(0, totalJmes - 1)));
                            return;
                          }
                          onValueChange(String(Math.max(0, totalBondedJmes)));
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        Max
                      </Button>
                    </Text>
                  </Box>
                </Flex>
                <Box marginTop="75px">
                  <Slider
                    focusThumbOnChange={false}
                    value={sliderValue}
                    isDisabled={delegatingToken}
                    defaultValue={sliderValue}
                    onChange={onChangeSlider}
                  >
                    <SliderTrack
                      background="darkPurple"
                      height="16px"
                      borderRadius="8px"
                    >
                      <SliderFilledTrack
                        background={bonding ? 'green' : 'lilac'}
                      />
                    </SliderTrack>
                    <SliderThumb
                      width="20px"
                      height="33px"
                      background="lilac"
                      border="1px solid"
                      borderColor="purple"
                      boxShadow="0px 1px 1px rgba(0, 0, 0, 0.25)"
                      position="relative"
                      borderRadius="4px"
                    >
                      <Box
                        width="16px"
                        height="1px"
                        background="purple"
                        transform="rotate(90deg)"
                        position="relative"
                        _before={{
                          content: '""',
                          position: 'absolute',
                          top: '-4px',
                          background: 'purple',
                          width: '16px',
                          height: '1px',
                        }}
                        _after={{
                          content: '""',
                          position: 'absolute',
                          bottom: '-4px',
                          background: 'purple',
                          width: '16px',
                          height: '1px',
                        }}
                      ></Box>
                      <Box
                        height="30px"
                        width="55px"
                        background="purple"
                        position="absolute"
                        bottom="calc(100% + 15px)"
                        left="50%"
                        transform="translateX(-50%)"
                        borderRadius={12}
                        boxShadow="0px 3.5px 5.5px rgba(0, 0, 0, 0.02)"
                        _after={{
                          content: '""',
                          borderTop: '15px solid var(--chakra-colors-purple)',
                          borderLeft: '7.5px solid transparent',
                          borderRight: '7.5px solid transparent',
                          position: 'absolute',
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                        }}
                      >
                        <Text
                          color="white"
                          fontFamily={'DM Sans'}
                          fontWeight="500"
                          fontSize={16}
                          lineHeight="15px"
                          textAlign="center"
                          marginTop="8px"
                        >
                          {sliderValue > 100 ? 'invalid' : `${sliderValue}%`}
                        </Text>
                      </Box>
                    </SliderThumb>
                  </Slider>

                  <Text color="red" fontSize="sm" height="4" textShadow="md">
                    {isMovingNotValid}
                  </Text>
                </Box>
                <Button
                  display="flex"
                  backgroundColor={bonding ? 'green' : 'lilac'}
                  borderRadius={90}
                  alignContent="end"
                  minWidth={'159px'}
                  width="auto"
                  height={'48px'}
                  alignSelf="center"
                  onClick={delegateTokens}
                  _hover={{ bg: bonding ? 'green' : 'lilac' }}
                  variant={'outline'}
                  borderWidth={'1px'}
                  borderColor={'rgba(0,0,0,0.1)'}
                  marginTop="30px"
                  marginBottom="40px"
                  marginX="auto"
                  disabled={!delegateButtonEnabled}
                >
                  {delegatingToken && (
                    <Spinner mr={4} size="sm" color="white" />
                  )}
                  <Text
                    color="midnight"
                    fontFamily={'DM Sans'}
                    fontWeight="medium"
                    fontSize={14}
                  >
                    {bonding ? 'Bond' : 'Unbond'}
                    <Image
                      src="/delegate-midnight.svg"
                      display="inline-block"
                      alt="icon"
                      width={'9px'}
                      height={'10px'}
                      marginLeft="8px"
                      marginRight={'4px'}
                    />
                    {formatBalanceWithComma(numberValueToMove, 6, 0)}
                  </Text>
                </Button>
                <Text
                  color="lilac"
                  fontFamily={'DM Sans'}
                  fontWeight="400"
                  fontSize={11}
                  lineHeight="14px"
                  textAlign="center"
                  padding="0 45px"
                  position="absolute"
                  bottom="24px"
                  left="0"
                  width="100%"
                >
                  Bonding JMES carries the risk of slashing. This means you
                  could lose some or all of your tokens. Do your own research
                  before deciding to bond JMES.
                </Text>
              </Box>
              <Box
                width={345}
                height={506}
                marginInlineStart="0 !important"
                background="darkPurple"
                borderRightRadius={12}
                position="relative"
              >
                <Tabs
                  variant="unstyled"
                  marginTop="41px"
                  padding="0 30px"
                  index={tabIndex}
                  onChange={handleTabsChange}
                >
                  <TabList>
                    <Tab
                      padding="0 0 10px"
                      opacity={0.5}
                      _selected={{ opacity: '1' }}
                    >
                      <Text
                        color="white"
                        fontFamily={'DM Sans'}
                        fontWeight="500"
                        fontSize={16}
                      >
                        Select a validator
                      </Text>
                    </Tab>
                    <Tab
                      padding="0 0 10px"
                      marginLeft="40px"
                      opacity={0.5}
                      _selected={{ opacity: '1' }}
                    >
                      <Text
                        color="white"
                        fontFamily={'DM Sans'}
                        fontWeight="500"
                        fontSize={16}
                      >
                        My unbonding
                      </Text>
                    </Tab>
                  </TabList>
                  <TabIndicator
                    mt="-1.5px"
                    height="2px"
                    bg="white"
                    borderRadius="1px"
                    width="80%"
                  />
                  <TabPanels>
                    <TabPanel padding={0}>
                      {bonding && (
                        <DelegateValidatorTable
                          validatorsMap={validatorsMap}
                          error={validatorsError as Error | undefined}
                          selectedValidator={selectedValidator}
                          loading={isValidatorsLoading}
                          validatorsData={validatorList}
                          onSelectValidator={id => {
                            setBondingState(p => ({
                              ...p,
                              selectedValidator: id,
                            }));
                          }}
                        />
                      )}
                      {!bonding && (
                        <UnBondValidatorTable
                          validatorsMap={validatorsMap}
                          error={bondedValidatorsError as Error | undefined}
                          selectedValidator={selectedUnBonding}
                          loading={isBondedValidatorsLoading}
                          validatorsData={bondedValidators}
                          onSelectValidator={id => {
                            setBondingState(p => ({
                              ...p,
                              selectedUnBonding: id,
                            }));
                          }}
                        />
                      )}
                    </TabPanel>
                    <TabPanel padding={0} marginTop="30px">
                      <DelegateUnbondingTable
                        unBondingsData={unBondingsData}
                        isLoadingUnBondings={isLoadingUnBondings}
                        unBondingsError={unBondingsError as Error | undefined}
                      />
                      <Text
                        color="lilac"
                        fontFamily={'DM Sans'}
                        fontWeight="400"
                        fontSize={11}
                        lineHeight="14px"
                        textAlign="center"
                        padding="0 41px"
                        position="absolute"
                        bottom="24px"
                        left="0"
                        width="100%"
                      >
                        Once requested, it takes 21 days for unbonded JMES to
                        become available.
                      </Text>
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
