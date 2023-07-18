import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Divider,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Switch,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useEffect, useMemo, useState } from 'react';
import { StdFee } from '@cosmjs/amino';
import {
  DaoMultisigClient,
  DaoMultisigQueryClient,
} from '../../client/DaoMultisig.client';
import { useDaoMultisigProposeMutation } from '../../client/DaoMultisig.react-query';
import type { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

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
import { parseMsg } from '../../utils/proposalUti';
import { useRouter } from 'next/router';

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
  const [fundingAmount, setFundingAmount] = useState(0);
  const [fundingPeriod, setFundingPeriod] = useState(default_funding_duration);
  const [isCreatingGovProposal, setCreatingGovProposal] = useState(false);
  const [revokeProposalId, setRevokeId] = useState(-1);
  const [daoMembers, setDaoMembers] = useState<VoterDetail[]>([]);
  const [daoThreshold, setDaoThreshold] = useState<number | string>(0);

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
    return (
      selectedProposalType === 'core-slot' &&
      daoMembers.length > 0 &&
      (daoMembers.length < 3 ||
        daoMembers.some(member => member.weight > Number(daoThreshold) ?? 0))
    );
  }, [daoMembers, daoThreshold, selectedProposalType]);

  const [numberOfNFTToMint, setNumberOfNFTToMint] = useState(0);
  const { signingCosmWasmClient: signingClient } =
    useSigningCosmWasmClientContext();

  const daoClient: DaoMultisigClient = new DaoMultisigClient(
    signingClient as SigningCosmWasmClient,
    address as string,
    selectedDao ?? '',
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

  const isFormValid =
    proposalTitle.value.length > 1 &&
    proposalTitle.error === '' &&
    proposalDescription.value.length > 1 &&
    proposalDescription.error === '';

  return (
    <>
      <Flex height={'47px'} />
      <Flex>
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
        <Box
          width={'6px'}
          height={'6px'}
          backgroundColor={'darkPurple'}
          mx={'18px'}
          alignSelf={'center'}
          borderRadius={100}
        />
        <Text
          color={'darkPurple'}
          fontWeight="normal"
          fontSize={28}
          fontFamily="DM Sans"
        >
          Create Governance Proposal
        </Text>
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
          {allowedProposalTypes
            .filter(
              el =>
                el !== 'revoke-proposal' ||
                (el === 'revoke-proposal' && advancedOption === '1'),
            )
            .map(proposalType => (
              <ProposalType
                key={proposalType}
                type={proposalType}
                isActive={proposalType === selectedProposalType}
                onClick={() => setSelectedProposalType(proposalType)}
              />
            ))}
        </Box>
        <Box width={'100%'} marginRight={'52px'} position="relative">
          {selectedProposalType === 'core-slot' && coreSlotsDisabled && (
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              rounded="xl"
              p="8"
              textAlign="center"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Membership Violation!
              </AlertTitle>
              <AlertDescription maxWidth="lg">
                Your current Dao membership is in violation of the membership
                rules
              </AlertDescription>
            </Alert>
          )}
          {!(selectedProposalType === 'core-slot' && coreSlotsDisabled) && (
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
              <Input
                variant={'outline'}
                width={'874px'}
                height={'48px'}
                borderColor={'primary.500'}
                background={'primary.100'}
                focusBorderColor={proposalTitle.error ? 'red' : 'darkPurple'}
                borderRadius={12}
                color={'purple'}
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
              <Textarea
                variant={'outline'}
                width={'874px'}
                height={'320px'}
                borderColor={'primary.500'}
                background={'primary.100'}
                isInvalid={proposalDescription.error !== ''}
                value={proposalDescription.value}
                errorBorderColor="red"
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
                  <Divider
                    width={'872px'}
                    color={'red'}
                    orientation="horizontal"
                    height={'2px'}
                    p={0}
                    borderColor={'lilac'}
                  />
                  <Input
                    variant={'outline'}
                    width={'874px'}
                    height={'50px'}
                    type={'number'}
                    borderColor={'primary.500'}
                    background={'primary.100'}
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
                <Box marginTop={'10px'} width={'872px'}>
                  <Divider
                    width={'872px'}
                    color={'red'}
                    orientation="horizontal"
                    height={'2px'}
                    p={0}
                    borderColor={'lilac'}
                  />
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
                <Box marginTop={'25px'} width={'872px'}>
                  <Flex marginBottom={'17px'} alignItems="center">
                    <Text
                      color={'darkPurple'}
                      fontWeight="normal"
                      fontSize={16}
                      fontFamily="DM Sans"
                      marginRight={'52px'}
                    >
                      Select feature type::
                    </Text>
                    <RadioGroup value="art-dealer" textColor={'darkPurple'}>
                      <Stack direction="row" spacing={'35px'}>
                        <Radio value="art-dealer">Art Dealer</Radio>
                      </Stack>
                    </RadioGroup>
                    <Flex
                      marginLeft={'28px'}
                      alignItems="center"
                      height={'41px'}
                    >
                      <Text
                        color={'darkPurple'}
                        fontWeight="normal"
                        fontSize={16}
                        fontFamily="DM Sans"
                      >
                        Number of NFT’s to Mint
                      </Text>
                      <Input
                        width={'106px'}
                        height={'41px'}
                        borderColor={'primary.500'}
                        background={'transparent'}
                        type="number"
                        color={'purple'}
                        onChange={e =>
                          setNumberOfNFTToMint(parseInt(e.target.value))
                        }
                        border="none"
                        borderBottom="1px solid"
                        borderRadius="0"
                        px="0px"
                        mx="10px"
                        textAlign={'center'}
                        _focus={{
                          boxShadow: 'none',
                          borderBottom: '1px solid',
                        }}
                      />
                    </Flex>
                  </Flex>
                  <Divider
                    width={'872px'}
                    color={'red'}
                    orientation="horizontal"
                    height={'2px'}
                    p={0}
                    borderColor={'lilac'}
                  />
                </Box>
              )}
              {isSlotTypeRequired && (
                <Box marginTop={'25px'} width={'872px'}>
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
                        <Radio value="brand">Brand</Radio>
                        <Radio value="core-tech">Core Tech</Radio>
                        <Radio value="creative">Creative</Radio>
                      </Stack>
                    </RadioGroup>
                  </Flex>
                  <Divider
                    width={'872px'}
                    color={'red'}
                    orientation="horizontal"
                    height={'2px'}
                    p={0}
                    borderColor={'lilac'}
                  />
                </Box>
              )}
              {isFundigRequired ? (
                <Box width={'872px'}>
                  <Flex
                    marginBottom={'17px'}
                    height={'41px'}
                    align={'flex-end'}
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
                          id="funding-option"
                          isChecked={isFundingNeeded}
                          onChange={() => setFundingNeeded(!isFundingNeeded)}
                        />
                        <Text
                          color={'darkPurple'}
                          fontWeight="normal"
                          fontSize={16}
                          fontFamily="DM Sans"
                          marginLeft={'8px'}
                        >
                          Yes
                        </Text>
                      </Flex>
                    )}
                    {(isFundingNeeded || selectedProposalType !== 'text') && (
                      <Flex height={'41px'} align={'flex-end'}>
                        <Text
                          color={'darkPurple'}
                          fontWeight="normal"
                          fontSize={16}
                          fontFamily="DM Sans"
                        >
                          Please pay me
                        </Text>
                        <Input
                          width={'106px'}
                          height={'41px'}
                          borderColor={'primary.500'}
                          background={'transparent'}
                          color={'purple'}
                          value={fundingAmount}
                          onChange={e =>
                            setFundingAmount(parseInt(e.target.value))
                          }
                          border="none"
                          borderBottom="1px solid"
                          borderRadius="0"
                          px="0px"
                          mx="10px"
                          textAlign={'center'}
                          type={'number'}
                          _focus={{
                            boxShadow: 'none',
                            borderBottom: '1px solid',
                          }}
                        />
                        <Text
                          color={'darkPurple'}
                          fontWeight="normal"
                          fontSize={16}
                          fontFamily="DM Sans"
                        >
                          tokens over
                        </Text>
                        <Input
                          width={'106px'}
                          height={'41px'}
                          value={fundingPeriod}
                          borderColor={'primary.500'}
                          background={'transparent'}
                          focusBorderColor="darkPurple"
                          color={'purple'}
                          onChange={
                            e => setFundingPeriod(parseInt(e.target.value)) // convert period in months to blocks
                          }
                          border="none"
                          borderBottom="1px solid"
                          borderRadius="0"
                          px="0"
                          mx="10px"
                          textAlign={'center'}
                          type={'number'}
                          _focus={{
                            boxShadow: 'none',
                            borderBottom: '1px solid',
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
                    )}
                  </Flex>
                  <Divider
                    width={'872px'}
                    color={'red'}
                    orientation="horizontal"
                    height={'2px'}
                    p={0}
                    borderColor={'lilac'}
                  />
                </Box>
              ) : (
                ''
              )}
              <Flex
                marginTop={'42px'}
                marginBottom={'93px'}
                height={'48px'}
                alignItems={'center'}
                width={'874px'}
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
                  onClick={async () => {
                    try {
                      //
                      const proposalMsg = {
                        propose: getProposalExecuteMsg({
                          improvementMsgs,
                          type: selectedProposalType,
                          featureApproved: numberOfNFTToMint,

                          isFundingRequired: isFundingNeeded,
                          // convert to blocks
                          amount: fundingAmount,
                          title: proposalTitle.value,
                          description: proposalDescription.value,
                          duration: convertMonthToBlock(fundingPeriod), // months to seconds
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

                      const result =
                        await createGovProposalMutation.mutateAsync({
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
                        ?.attributes.find(
                          el => el.key === 'proposal_id',
                        )?.value;
                      if (!id) {
                        throw new Error('Proposal id not found');
                      }
                      toast({
                        title: 'Proposal created.',
                        description: "We've created your Proposal.",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                        containerStyle: {
                          backgroundColor: 'darkPurple',
                          borderRadius: 12,
                        },
                      });
                      restForm();
                      navigate(`/dao/view/${selectedDaoName}`);
                    } catch (err) {
                      if (err instanceof Error) {
                        toast({
                          title: 'Proposal creation error',
                          description: err.toString(),
                          status: 'error',
                          duration: 9000,
                          isClosable: true,
                          containerStyle: {
                            backgroundColor: 'red',
                            borderRadius: 12,
                          },
                        });
                      }
                    }

                    setCreatingGovProposal(false);
                    setCheck(true);
                  }}
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
          )}
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
  improvementMsgs,
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
  improvementMsgs: string;
}) => {
  // "text", "core-slot", "revoke-core-slot", "improvement"
  let msg: Governance.ProposalMsg;
  switch (type) {
    case 'text':
      msg = {
        text_proposal: {
          description,
          title,
          funding: {
            amount: amount?.toString() as string,
            duration_in_blocks: duration as number,
          },
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
    case 'improvement': {
      try {
        const impMsg = parseMsg(
          improvementMsgs,
        ) as Governance.CosmosMsgForEmpty[];
        msg = {
          improvement: {
            description,
            title,
            msgs: impMsg as Governance.CosmosMsgForEmpty[],
          },
        };
        return msg;
      } catch (err) {
        throw new Error('Improvement message is not valid');
      }
    }
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
