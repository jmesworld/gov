import {
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
import { useMemo, useState } from 'react';
import { StdFee } from '@cosmjs/amino';
import { DaoMultisigClient } from '../../client/DaoMultisig.client';
import { useDaoMultisigProposeMutation } from '../../client/DaoMultisig.react-query';

import { ProposalType } from '../components/Proposal/ProposalType';
import { toBase64 } from '../../utils/identity';
import * as Governance from '../../client/Governance.types';
import { useSigningCosmWasmClientContext } from '../../contexts/SigningCosmWasmClient';
import { useIdentityContext } from '../../contexts/IdentityContext';
import { useLeaveConfirm } from '../../hooks/useLeaveConfirm';
import { isDirty } from 'zod';

// TODO: DEEP- refactor needed for the whole page
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

const fee: StdFee = {
  amount: [{ amount: '30000', denom: 'ujmes' }],
  gas: '10000000',
};

const default_funding_duration = (3 * 30 * 86400) / 5; // convert 3 months to number of blocks
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
  const { address } = useIdentityContext();

  const toast = useToast();
  const [selectedProposalType, setSelectedProposalType] =
    useState<ProposalTypes>(allowedProposalTypes[0]);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [slotType, setSlotType] = useState('brand');
  const [isFundingNeeded, setFundingNeeded] = useState(false);
  const [fundingAmount, setFundingAmount] = useState(0);
  const [fundingPeriod, setFundingPeriod] = useState(default_funding_duration);
  const [isCreatingGovProposal, setCreatingGovProposal] = useState(false);
  const [revokeProposalId, setRevokeId] = useState(-1);

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
      proposalTitle ||
      proposalDescription ||
      slotType !== 'brand' ||
      isFundingNeeded ||
      fundingAmount ||
      fundingPeriod !== default_funding_duration ||
      isCreatingGovProposal ||
      revokeProposalId !== -1
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
  ]);

  useLeaveConfirm({
    preventNavigatingAway: !!isDirty,
  });

  // Dynamically show required sections for different proposal types
  const isSlotTypeRequired = selectedProposalType === 'core-slot';
  const isFeatureRequestRequired = selectedProposalType === 'feature-request';
  const isFundigRequired =
    selectedProposalType === 'text' ||
    selectedProposalType === 'core-slot' ||
    selectedProposalType === 'feature-request';
  const isImproventRequired = selectedProposalType === 'improvement';

  const createGovProposalMutation = useDaoMultisigProposeMutation();

  const isFormValid =
    proposalTitle.length > 1 && proposalDescription.length > 1;

  return (
    <>
      <Flex height={'47px'} />
      <Flex>
        <Text
          color={'darkPurple'}
          fontWeight="bold"
          fontSize={30}
          fontFamily="DM Sans"
          style={{ textDecoration: 'underline' }}
        >
          {selectedDaoName}
        </Text>
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
          {allowedProposalTypes.map(proposalType => (
            <ProposalType
              key={proposalType}
              type={proposalType}
              isActive={proposalType === selectedProposalType}
              onClick={() => setSelectedProposalType(proposalType)}
            />
          ))}
        </Box>
        <Box width={'220px'} marginRight={'52px'}>
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
            focusBorderColor="darkPurple"
            borderRadius={12}
            color={'purple'}
            onChange={e => setProposalTitle(e.target.value)}
            placeholder={'Title'}
          />
          <Box height={'12px'} />
          <Textarea
            variant={'outline'}
            width={'874px'}
            height={'320px'}
            borderColor={'primary.500'}
            background={'primary.100'}
            focusBorderColor="darkPurple"
            borderRadius={12}
            color={'purple'}
            onChange={e => setProposalDescription(e.target.value)}
            placeholder={'Description'}
          />
          {selectedProposalType === 'revoke-proposal' ? (
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
          ) : (
            ''
          )}
          {isImproventRequired ? (
            <Box marginTop={'10px'} width={'872px'}>
              <Divider
                width={'872px'}
                color={'red'}
                orientation="horizontal"
                height={'2px'}
                p={0}
                borderColor={'lilac'}
              />
              <Textarea
                variant={'outline'}
                width={'874px'}
                height={'138px'}
                borderColor={'primary.500'}
                background={'primary.100'}
                focusBorderColor="darkPurple"
                borderRadius={12}
                marginTop={'12px'}
                color={'purple'}
                onChange={e => setProposalDescription(e.target.value)}
                placeholder={'Improvement Msg'}
              />
            </Box>
          ) : (
            ''
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
                <Flex marginLeft={'28px'} alignItems="center" height={'41px'}>
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
              <Flex marginBottom={'17px'} height={'41px'} align={'flex-end'}>
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
                {isFundingNeeded ? (
                  <Flex marginLeft={'28px'} height={'41px'} align={'flex-end'}>
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
                      onChange={e => setFundingAmount(parseInt(e.target.value))}
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
                      borderColor={'primary.500'}
                      background={'transparent'}
                      focusBorderColor="darkPurple"
                      color={'purple'}
                      onChange={
                        e =>
                          setFundingPeriod(
                            parseInt(e.target.value) * 30 * 86400,
                          ) // convert period in months to blocks
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
                ) : (
                  ''
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
              onClick={() => setCreateGovProposalSelected(false)}
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
              onClick={() => {
                //
                const proposalMsg = {
                  propose: getProposalExecuteMsg({
                    type: selectedProposalType,
                    featureApproved: numberOfNFTToMint,

                    isFundingRequired: isFundingNeeded,
                    amount: fundingAmount,
                    duration: fundingPeriod * 30 * 24 * 60 * 60, // months to seconds
                    title: proposalTitle,
                    description: proposalDescription,
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
                setCreatingGovProposal(true);
                const wasmMsg: Governance.WasmMsg = {
                  execute: {
                    contract_addr: NEXT_PUBLIC_GOVERNANCE_CONTRACT,
                    funds: [{ amount: '10000000', denom: 'ujmes' }],
                    msg: toBase64(proposalMsg),
                  },
                };

                createGovProposalMutation
                  .mutateAsync({
                    client: daoClient,
                    msg: {
                      title: proposalTitle,
                      description: proposalDescription,
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
                  })
                  .then(() => {
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
                    setCreateGovProposalSelected(false);
                  })
                  .catch(error => {
                    toast({
                      title: 'Proposal creation error',
                      description: error.toString(),
                      status: 'error',
                      duration: 9000,
                      isClosable: true,
                      containerStyle: {
                        backgroundColor: 'red',
                        borderRadius: 12,
                      },
                    });
                  })
                  .finally(() => {
                    setCreatingGovProposal(false);
                  });
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
  msgs,
  amount,
  duration,
  featureApproved,
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
  // "text", "core-slot", "revoke-core-slot", "improvement"
  let msg: Governance.ProposalMsg;
  switch (type) {
    case 'text':
      msg = {
        text_proposal: {
          description: description,
          title: title,
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
          description: description,
          title: title,
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
          description: description,
          revoke_proposal_id: revoke_proposal_id as number,
          title: title,
        },
      };
      return msg;
    case 'improvement':
      msg = {
        improvement: {
          description: description,
          title: title,
          msgs: msgs as Governance.CosmosMsgForEmpty[],
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
