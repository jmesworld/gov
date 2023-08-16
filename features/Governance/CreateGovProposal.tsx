import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  CircularProgress,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Skeleton,
  Spacer,
  Stack,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import React, { useEffect, useMemo, useState } from 'react';
import { StdFee } from '@cosmjs/amino';
import {
  DaoMultisigClient,
  DaoMultisigQueryClient,
} from '../../client/DaoMultisig.client';
import { useDaoMultisigProposeMutation } from '../../client/DaoMultisig.react-query';
import type { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { NumericFormat } from 'react-number-format';
import { ProposalType } from '../components/Proposal/ProposalType';
import { toBase64 } from '../../utils/identity';
import * as Governance from '../../client/Governance.types';
import { useSigningCosmWasmClientContext } from '../../contexts/SigningCosmWasmClient';
import { useIdentityContext } from '../../contexts/IdentityContext';
import { useLeaveConfirm } from '../../hooks/useLeaveConfirm';
import dynamic from 'next/dynamic';
import { Link } from '../components/genial/Link';
import {
  proposalDescriptionValidator,
  proposalTitleValidator,
} from '../../utils/proposalValidate';
import { convertMonthToBlock } from '../../utils/block';
import { useCosmWasmClientContext } from '../../contexts/CosmWasmClient';
import { VoterDetail } from '../../client/DaoMultisig.types';
import { useRouter } from 'next/router';
import { ClosePageButton } from '../components/genial/ClosePageButton';
import {
  numberWithDecimals,
  numberWithNoDecimals,
  onNumberWithNoDecimalKeyDown,
} from '../../utils/numberValidators';
import { useCoreSlotProposalsContext } from '../../contexts/CoreSlotProposalsContext';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { handleError } from '../../error/hanldeErrors';
import { InputStyled } from '../components/common/Input';
import { TextareaStyled } from '../components/common/textarea';

// TODO: DEEP- refactor needed for the whole page
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;
const CodeEditor = dynamic(import('../components/genial/CodeEditor'), {
  ssr: false,
});
const fee: StdFee = {
  amount: [{ amount: '30000', denom: 'ujmes' }],
  gas: '10000000',
};

const default_funding_duration = 3;
export type ProposalTypes =
  | 'text'
  | 'core-slot'
  | 'revoke-proposal'
  | 'improvement'
  | 'feature-request';
const allowedProposalTypes: ProposalTypes[] = [
  'text',
  'core-slot',
  'revoke-proposal',
  'improvement',
  'feature-request',
];

//TODO: UPDATE FOR PROD. minimum duration in block
const minimumDuration = 0.001;
const decimalPointAllowedInDuration = 3;

export default function CreateGovProposal({
  selectedDao,
  selectedDaoName,
  setCreateGovProposalSelected,
}: {
  selectedDao?: string;
  selectedDaoName?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setCreateGovProposalSelected: Function;
}) {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const { coreSlotDaoIds } = useCoreSlotProposalsContext();
  const daoQueryClient = useMemo(
    () =>
      new DaoMultisigQueryClient(
        cosmWasmClient as CosmWasmClient,
        selectedDao as string,
      ),
    [cosmWasmClient, selectedDao],
  );

  const { address } = useIdentityContext();
  const toast = useToast();

  const router = useRouter();
  const advancedOption = router?.query?.advanced;

  const [selectedProposalType, setSelectedProposalType] =
    useState<ProposalTypes>(allowedProposalTypes[0]);
  const [proposalTitle, setProposalTitle] = useState<{
    value: string;
    error: string;
  }>({
    value: '',
    error: '',
  });
  const [proposalDescription, setProposalDescription] = useState({
    value: '',
    error: '',
  });
  const [improvementMsgs, setImprovementMsgs] = useState<string>('');
  const [slotType, setSlotType] = useState('brand');
  const [isFundingNeeded, setFundingNeeded] = useState(false);
  const [fundingAmount, setFundingAmount] = useState<'' | number>(0);
  const [fundingPeriod, setFundingPeriod] = useState<'' | number>(
    default_funding_duration,
  );
  const [isCreatingGovProposal, setCreatingGovProposal] = useState(false);
  const [revokeProposalId, setRevokeId] = useState(-1);
  const [daoMembers, setDaoMembers] = useState<VoterDetail[] | null>(null);
  const [daoThreshold, setDaoThreshold] = useState<number | string>(0);

  const fundingPeriodError = (Number(fundingPeriod) || 0) < minimumDuration;
  useEffect(() => {
    const getMemberList = async () => {
      try {
        const result = await daoQueryClient.listVoters({});
        const threshold = await daoQueryClient.threshold();
        if ('absolute_count' in threshold) {
          setDaoThreshold(threshold.absolute_count.weight);
        }
        if ('absolute_percentage' in threshold) {
          setDaoThreshold(threshold.absolute_percentage.percentage);
        }
        if ('threshold_quorum' in threshold) {
          setDaoThreshold(threshold.threshold_quorum.threshold.toString());
        }

        setDaoMembers(result.voters);
      } catch (err) {
        console.error(err);
      }
    };
    getMemberList();
  }, [daoQueryClient]);

  const coreSlotsDisabled = useMemo(() => {
    if (daoMembers === null) return true;
    return (
      daoMembers.length > 0 &&
      (daoMembers.length < 3 ||
        daoMembers.some(member => member.weight >= Number(daoThreshold) ?? 0))
    );
  }, [daoMembers, daoThreshold]);

  const [numberOfNFTToMint, setNumberOfNFTToMint] = useState<'' | number>(0);
  const { signingCosmWasmClient: signingClient } =
    useSigningCosmWasmClientContext();

  const daoClient: DaoMultisigClient = new DaoMultisigClient(
    signingClient as SigningCosmWasmClient,
    address as string,
    selectedDao ?? '',
  );
  const proposalList = useMemo(
    () =>
      allowedProposalTypes.filter(el => {
        if (
          el === 'improvement' &&
          !coreSlotDaoIds?.includes(selectedDao ?? '')
        ) {
          return false;
        }
        if (el === 'core-slot' && coreSlotsDisabled) {
          return false;
        }
        if (el === 'revoke-proposal' && advancedOption !== '1') {
          return false;
        }
        return true;
      }),
    [advancedOption, coreSlotDaoIds, coreSlotsDisabled, selectedDao],
  );
  const isDirty = useMemo(() => {
    return (
      proposalTitle.value ||
      proposalDescription.value ||
      slotType !== 'brand' ||
      isFundingNeeded ||
      fundingAmount ||
      fundingPeriod !== default_funding_duration ||
      isCreatingGovProposal ||
      revokeProposalId !== -1 ||
      numberOfNFTToMint !== 0
    );
  }, [
    fundingAmount,
    fundingPeriod,
    isCreatingGovProposal,
    isFundingNeeded,
    proposalDescription,
    proposalTitle,
    revokeProposalId,
    slotType,
    numberOfNFTToMint,
  ]);

  const restForm = () => {
    setProposalTitle({
      value: '',
      error: '',
    });
    setProposalDescription({
      value: '',
      error: '',
    });
    setSlotType('brand');
    setFundingNeeded(false);
    setFundingAmount(0);
    setFundingPeriod(default_funding_duration);
    setCreatingGovProposal(false);
    setRevokeId(-1);
    setNumberOfNFTToMint(0);
  };

  const [setCheck, navigate] = useLeaveConfirm({
    preventNavigatingAway: !!isDirty,
  });

  // Dynamically show required sections for different proposal types
  const isSlotTypeRequired = selectedProposalType === 'core-slot';
  const isFeatureRequestRequired = selectedProposalType === 'feature-request';
  const isFundigRequired =
    selectedProposalType === 'text' ||
    selectedProposalType === 'core-slot' ||
    selectedProposalType === 'feature-request';
  const isImprovementRequired = selectedProposalType === 'improvement';

  const createGovProposalMutation = useDaoMultisigProposeMutation();

  const onSubmit = async () => {
    try {
      if (selectedProposalType === 'improvement') {
        const parsedArr = JSON.parse(
          improvementMsgs,
        ) as Governance.CosmosMsgForEmpty[];
        if (!Array.isArray(parsedArr)) {
          throw new Error('Improvement message is not valid');
        }

        setCheck(false);
        setCreatingGovProposal(true);

        const proposalMsg = {
          propose: {
            improvement: {
              title: proposalTitle.value,
              description: proposalDescription.value,
              msgs: parsedArr,
            },
          },
        };

        const wasmMsg: Governance.WasmMsg = {
          execute: {
            contract_addr: NEXT_PUBLIC_GOVERNANCE_CONTRACT,
            funds: [{ amount: '10000000', denom: 'ujmes' }],
            msg: toBase64(proposalMsg),
          },
        };

        const result = await createGovProposalMutation.mutateAsync({
          client: daoClient,
          msg: {
            title: proposalTitle.value,
            description: proposalDescription.value,
            msgs: [{ wasm: wasmMsg }],
          },
        });
        toast({
          title: 'Proposal created!',
          status: 'success',
          variant: 'custom',
          duration: 9000,
          isClosable: true,
        });
        const id = result.events
          .find(e => e.type === 'wasm')
          ?.attributes.find(el => el.key === 'proposal_id')?.value;
        if (!id) {
          throw new Error('Proposal id not found');
        }
        restForm();
        navigate(`/dao/view/${selectedDaoName}/proposals/${id}`);
        return;
      }
      const proposalMsg = {
        propose: getProposalExecuteMsg({
          type: selectedProposalType,
          featureApproved: Number(numberOfNFTToMint),
          isFundingRequired: isFundingNeeded,
          // convert to blocks
          amount: Number(fundingAmount),
          title: proposalTitle.value,
          description: proposalDescription.value,
          duration: Math.floor(convertMonthToBlock(Number(fundingPeriod))), // months to seconds
          slot: getSlot(slotType) as Governance.CoreSlot,
          revoke_proposal_id: revokeProposalId,
          msgs: [
            {
              bank: {
                send: {
                  amount: [
                    {
                      denom: 'ujmes',
                      amount: '10000000',
                    },
                  ],
                  to_address: selectedDao as string,
                },
              },
            },
          ],
        }),
      };
      setCheck(false);
      setCreatingGovProposal(true);
      const wasmMsg: Governance.WasmMsg = {
        execute: {
          contract_addr: NEXT_PUBLIC_GOVERNANCE_CONTRACT,
          funds: [{ amount: '10000000', denom: 'ujmes' }],
          msg: toBase64(proposalMsg),
        },
      };

      const result = await createGovProposalMutation.mutateAsync({
        client: daoClient,
        msg: {
          title: proposalTitle.value,
          description: proposalDescription.value,
          msgs: [
            {
              wasm: wasmMsg,
            },
          ],
        },
        args: {
          fee,
          funds: [{ amount: '10000000', denom: 'ujmes' }],
        },
      });

      const id = result.events
        .find(e => e.type === 'wasm')
        ?.attributes.find(el => el.key === 'proposal_id')?.value;
      if (!id) {
        throw new Error('Proposal id not found');
      }
      toast({
        title: 'Proposal created!',
        status: 'success',
        variant: 'custom',
        duration: 9000,
        isClosable: true,
      });
      restForm();
      navigate(`/dao/view/${selectedDaoName}/proposals/${id}`);
    } catch (err) {
      handleError(err, 'Proposal creation error', toast);
    }

    setCreatingGovProposal(false);
    setCheck(true);
  };

  const isFormValid =
    proposalTitle.value.length > 1 &&
    proposalTitle.error === '' &&
    proposalDescription.value.length > 1 &&
    proposalDescription.error === '' &&
    !fundingPeriodError;

  const onFundingPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // TODO: change this on prod
    if (
      numberWithDecimals(decimalPointAllowedInDuration).safeParse(value).success
    ) {
      const numberValue = parseFloat(value);

      setFundingPeriod(numberValue);
      return;
    }
    if (value === '') {
      setFundingPeriod('');
    }
    e.preventDefault();
  };
  const onNumberOfNFTToMintChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value.replace(/,/g, '');
    if (numberWithDecimals(6).safeParse(value).success) {
      setNumberOfNFTToMint(Number(value));
    }
    if (value === '') {
      setNumberOfNFTToMint('');
    }
    e.stopPropagation;
    e.preventDefault();
  };

  const onFundingAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replaceAll(/,/g, '');
    if (numberWithNoDecimals.safeParse(value).success) {
      setFundingAmount(Number(value));
    }
    if (value === '') {
      setFundingAmount('');
    }
    e.preventDefault();
  };
  return (
    <>
      <Flex height={'47px'} />
      <Flex>
        <Breadcrumb
          separator={<ChevronRightIcon color="#7453FD" fontSize={'28px'} />}
        >
          <BreadcrumbItem>
            <Link href={`/dao/view/${selectedDaoName}`}>
              <Text
                color={'darkPurple'}
                cursor="pointer"
                fontWeight="bold"
                fontSize={30}
                fontFamily="DM Sans"
                style={{ textDecoration: 'underline' }}
              >
                {selectedDaoName}
              </Text>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Text
              color={'darkPurple'}
              fontWeight="normal"
              fontSize={28}
              fontFamily="DM Sans"
            >
              Create Governance Proposal
            </Text>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
      <Flex height={'46px'} />
      <Flex>
        <Box width={'220px'} marginRight={'44px'}>
          <Text
            color={'rgba(15,0,86,0.8)'}
            fontWeight="medium"
            fontSize={12}
            fontFamily="DM Sans"
            marginBottom={'17px'}
          >
            SELECT PROPOSAL TYPE
          </Text>
          {daoMembers === null && (
            <Flex flexDir="column" width={'220px'}>
              <Skeleton
                height="15px"
                startColor="skeleton.100"
                endColor="skeleton.200"
                rounded="full"
                width="100%"
                mb="30px"
              />
              <Skeleton
                height="15px"
                startColor="skeleton.100"
                endColor="skeleton.200"
                rounded="full"
                width="100%"
                mb="30px"
              />
              <Skeleton
                height="15px"
                startColor="skeleton.100"
                endColor="skeleton.200"
                rounded="full"
                width="100%"
                mb="30px"
              />
            </Flex>
          )}
          {daoMembers !== null &&
            proposalList.map(proposalType => (
              <ProposalType
                key={proposalType}
                type={proposalType}
                isActive={proposalType === selectedProposalType}
                onClick={() => setSelectedProposalType(proposalType)}
              />
            ))}
        </Box>
        <Box width={'100%'} position="relative">
          <>
            <Text
              color={'rgba(15,0,86,0.8)'}
              fontWeight="medium"
              fontSize={12}
              fontFamily="DM Sans"
              marginBottom={'17px'}
            >
              DETAILS
            </Text>
            <InputStyled
              height={'48px'}
              isInvalid={proposalTitle.error !== ''}
              errorBorderColor="red"
              onChange={e => {
                const parsedTitle = proposalTitleValidator.safeParse(
                  e.target.value,
                );
                setProposalTitle({
                  value: e.target.value,
                  error: parsedTitle.success
                    ? ''
                    : parsedTitle.error.errors[0].message,
                });
              }}
              placeholder={'Title'}
            />
            <Text
              color={'red'}
              fontWeight="normal"
              fontSize={12}
              height={'13px'}
              w="Full"
              fontFamily="DM Sans"
              mt="5px"
              mb={'10px'}
            >
              {proposalTitle.error}
            </Text>
            <Box height={'12px'} />
            <TextareaStyled
              height={'220px'}
              isInvalid={proposalDescription.error !== ''}
              value={proposalDescription.value}
              focusBorderColor={
                proposalDescription.error ? 'red' : 'darkPurple'
              }
              borderRadius={12}
              color={'purple'}
              onChange={e => {
                const parsedDescription =
                  proposalDescriptionValidator.safeParse(e.target.value);
                setProposalDescription({
                  value: e.target.value,
                  error: parsedDescription.success
                    ? ''
                    : parsedDescription.error.errors[0].message,
                });
              }}
              placeholder={'Description'}
            />
            <Text
              color={'red'}
              fontWeight="normal"
              fontSize={12}
              height={'13px'}
              w="Full"
              fontFamily="DM Sans"
              mt="5px"
              mb={'10px'}
            >
              {proposalDescription.error}
            </Text>
            {selectedProposalType === 'revoke-proposal' && (
              <Box marginTop={'10px'} width={'872px'}>
                <Input
                  variant={'outline'}
                  width={'full'}
                  height={'50px'}
                  type={'number'}
                  borderColor={'background.500'}
                  background={'background.100'}
                  focusBorderColor="darkPurple"
                  borderRadius={12}
                  marginTop={'12px'}
                  color={'purple'}
                  onChange={e => setRevokeId(parseInt(e.target.value))}
                  placeholder={'Proposal ID'}
                />
              </Box>
            )}
            {isImprovementRequired && (
              <Box marginTop={'10px'} mb="25px" width={'full'}>
                <Flex
                  mt="4"
                  background="rgba(112, 79, 247, 0.1)"
                  borderRadius="12px"
                  border="1px solid rgba(112, 79, 247, 0.5)"
                  padding="14px 16px"
                  marginTop="20px"
                  overflowY="auto"
                >
                  <CodeEditor
                    width="100%"
                    style={{
                      backgroundColor: 'transparent',
                      height: '300px',
                    }}
                    placeholder="Improvements"
                    setOptions={{
                      highlightActiveLine: true,
                      highlightGutterLine: true,
                      showPrintMargin: false,
                      hScrollBarAlwaysVisible: true,
                    }}
                    editorProps={{
                      $blockScrolling: false,
                    }}
                    value={improvementMsgs}
                    onChange={setImprovementMsgs}
                  />
                </Flex>
              </Box>
            )}
            {isFeatureRequestRequired && (
              <Box marginTop={'25px'} width={'full'}>
                <Flex marginBottom={'17px'} alignItems="center">
                  <Text
                    color={'darkPurple'}
                    fontWeight="normal"
                    fontSize={16}
                    minWidth={'100px'}
                    fontFamily="DM Sans"
                    marginRight={'52px'}
                  >
                    Feature type:
                  </Text>
                  <RadioGroup
                    minWidth="150px"
                    value="art-dealer"
                    textColor={'darkPurple'}
                  >
                    <Stack direction="row" spacing={'35px'}>
                      <Radio variant="purple" size="lg" value="art-dealer">
                        Art Dealer
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <Flex
                    marginLeft={'28px'}
                    alignItems="center"
                    height={'41px'}
                    w="full"
                  >
                    <Text
                      color={'darkPurple'}
                      fontWeight="normal"
                      fontSize={16}
                      fontFamily="DM Sans"
                      minWidth="100px"
                    >
                      Number of NFT’s to Mint
                    </Text>
                    <NumericFormat
                      customInput={Input}
                      thousandSeparator
                      displayType="input"
                      decimalScale={6}
                      width={'100px'}
                      height={'41px'}
                      borderColor={'background.500'}
                      background={'transparent'}
                      color={'purple'}
                      value={numberOfNFTToMint}
                      onChange={onNumberOfNFTToMintChange}
                      border="none"
                      borderBottom="1px solid"
                      borderRadius="0"
                      px="0px"
                      mx="10px"
                      textAlign={'center'}
                      _invalid={{
                        boxShadow: 'none',
                      }}
                      _focus={{
                        boxShadow: 'none',
                        borderBottom: '1px solid',
                      }}
                      _hover={{
                        borderColor: 'darkPurple',
                      }}
                    />
                  </Flex>
                </Flex>
              </Box>
            )}
            {isSlotTypeRequired && (
              <Box marginTop={'25px'} width={'full'}>
                <Flex marginBottom={'17px'}>
                  <Text
                    color={'darkPurple'}
                    fontWeight="normal"
                    fontSize={16}
                    fontFamily="DM Sans"
                    marginRight={'52px'}
                  >
                    Select Slot type:
                  </Text>
                  <RadioGroup
                    onChange={setSlotType}
                    value={slotType}
                    textColor={'darkPurple'}
                  >
                    <Stack direction="row" spacing={'35px'}>
                      <Radio size="lg" variant="purple" value="brand">
                        Brand
                      </Radio>
                      <Radio size="lg" variant="purple" value="core-tech">
                        Tech
                      </Radio>
                      <Radio size="lg" variant="purple" value="creative">
                        Creative
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Flex>
              </Box>
            )}

            {isFundigRequired ? (
              <Box width={'full'}>
                <Flex
                  flexDir="column"
                  marginBottom={'17px'}
                  height={'60px'}
                  align={'flex-start'}
                >
                  {selectedProposalType === 'text' && (
                    <Flex mr={'28px'}>
                      <Text
                        color={'darkPurple'}
                        fontWeight="normal"
                        fontSize={16}
                        fontFamily="DM Sans"
                        marginRight={'52px'}
                      >
                        Do you need funding?
                      </Text>

                      <Switch
                        variant="secondary"
                        color="primary"
                        isChecked={isFundingNeeded}
                        onChange={() => setFundingNeeded(!isFundingNeeded)}
                      />
                    </Flex>
                  )}
                  {(isFundingNeeded || selectedProposalType !== 'text') && (
                    <Box w="full" mb="10px">
                      <Flex height={'41px'} w="full" align={'flex-end'}>
                        <Text
                          color={'darkPurple'}
                          fontWeight="normal"
                          fontSize={16}
                          fontFamily="DM Sans"
                          minWidth={'150px'}
                        >
                          Please pay me
                        </Text>
                        <NumericFormat
                          customInput={Input}
                          width={'100px'}
                          height={'41px'}
                          borderColor={'background.500'}
                          background={'transparent'}
                          color={'purple'}
                          value={fundingAmount}
                          onKeyDown={onNumberWithNoDecimalKeyDown}
                          onChange={onFundingAmountChange}
                          _invalid={{
                            boxShadow: 'none',
                          }}
                          _focus={{
                            boxShadow: 'none',
                            borderBottom: '1px solid',
                          }}
                          _hover={{
                            borderColor: 'darkPurple',
                          }}
                          border="none"
                          borderBottom="1px solid"
                          borderRadius="0"
                          thousandSeparator
                          px="0px"
                          mx="10px"
                          textAlign={'center'}
                          inputMode="numeric"
                          displayType="input"
                        />
                        <Text
                          color={'darkPurple'}
                          fontWeight="normal"
                          fontSize={16}
                          minWidth={'100px'}
                          fontFamily="DM Sans"
                        >
                          tokens over
                        </Text>

                        <Input
                          isInvalid={fundingPeriodError}
                          width={'100px'}
                          value={fundingPeriod}
                          borderColor={
                            fundingPeriodError ? 'red' : 'background.500'
                          }
                          height={'41px'}
                          background={'transparent'}
                          focusBorderColor={
                            fundingPeriodError ? 'red' : 'darkPurple'
                          }
                          color={'purple'}
                          onChange={onFundingPeriodChange}
                          borderTop={'none'}
                          borderLeft={'none'}
                          borderRight={'none'}
                          borderRadius="0"
                          px="0"
                          mx="10px"
                          textAlign={'center'}
                          type={'number'}
                          _invalid={{
                            boxShadow: 'none',
                          }}
                          _focus={{
                            boxShadow: 'none',
                          }}
                          _hover={{
                            borderColor: fundingPeriodError
                              ? 'red'
                              : 'darkPurple',
                          }}
                        />

                        <Text
                          color={'darkPurple'}
                          fontWeight="normal"
                          fontSize={16}
                          fontFamily="DM Sans"
                        >
                          months.
                        </Text>
                      </Flex>
                    </Box>
                  )}
                </Flex>
              </Box>
            ) : (
              ''
            )}
            <ClosePageButton showCloseButton={false} />
            <Flex
              marginTop={'42px'}
              marginBottom={'93px'}
              height={'48px'}
              alignItems={'center'}
              width={'full'}
            >
              <Spacer />
              <Button
                width={'99px'}
                height={'42px'}
                variant={'link'}
                onClick={() => {
                  navigate(`/dao/view/${selectedDaoName}`);
                  setCreateGovProposalSelected(false);
                }}
              >
                <Text
                  color={'darkPurple'}
                  fontFamily="DM Sans"
                  fontSize={14}
                  fontWeight="medium"
                  style={{ textDecoration: 'underline' }}
                >
                  Cancel
                </Text>
              </Button>
              <Box width={'12px'} />
              <Button
                disabled={!isFormValid}
                onClick={onSubmit}
                backgroundColor={'green'}
                borderRadius={90}
                alignContent="end"
                width={'148px'}
                height={'42px'}
                alignSelf="center"
                _hover={{ bg: 'green' }}
                variant={'outline'}
                borderWidth={'1px'}
                borderColor={'rgba(0,0,0,0.1)'}
              >
                {!isCreatingGovProposal ? (
                  <Text
                    color="midnight"
                    fontFamily={'DM Sans'}
                    fontWeight="medium"
                    fontSize={14}
                  >
                    Create
                  </Text>
                ) : (
                  <CircularProgress
                    isIndeterminate
                    size={'24px'}
                    color="midnight"
                  />
                )}
              </Button>
            </Flex>
          </>
        </Box>
      </Flex>
    </>
  );
}

const getProposalExecuteMsg = ({
  type,
  title,
  description,
  slot,
  revoke_proposal_id,
  amount,
  duration,
  featureApproved,
  isFundingRequired,
}: {
  type: ProposalTypes;
  title: string;
  description: string;
  slot?: Governance.CoreSlot;
  revoke_proposal_id?: number;
  msgs?: Governance.CosmosMsgForEmpty[];
  isFundingRequired?: boolean;
  amount?: number;
  duration?: number;
  featureApproved: number;
}) => {
  let msg: Governance.ProposalMsg;
  switch (type) {
    case 'text':
      msg = {
        text_proposal: {
          description,
          title,
          ...(isFundingRequired
            ? {
                funding: {
                  amount: amount?.toString() as string,
                  duration_in_blocks: duration as number,
                },
              }
            : {}),
        },
      };
      return msg;
    case 'core-slot':
      msg = {
        core_slot: {
          description,
          title,
          slot: slot as Governance.CoreSlot,
          funding: {
            amount: amount?.toString() as string,
            duration_in_blocks: duration as number,
          },
        },
      };
      return msg;
    case 'revoke-proposal':
      msg = {
        revoke_proposal: {
          description,
          revoke_proposal_id: revoke_proposal_id as number,
          title: title,
        },
      };
      return msg;
    case 'feature-request':
      msg = {
        request_feature: {
          feature: {
            art_dealer: {
              approved: featureApproved,
            },
          },
          description: description,
          title: title,
          funding: {
            amount: amount?.toString() as string,
            duration_in_blocks: duration as number,
          },
        },
      };
      return msg;
  }
};

const getSlot = (type: string) => {
  switch (type) {
    case 'brand':
      return { brand: {} };
    case 'creative':
      return { creative: {} };
    case 'core-tech':
      return { core_tech: {} };
  }
};
