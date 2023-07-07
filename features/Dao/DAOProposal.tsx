import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Spacer,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { IdentityserviceQueryClient } from '../../client/Identityservice.client';
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';

import { ProposalType } from '../components/Proposal/ProposalType';
import { DAOProposalReducer, Member, State } from './DaoProposalReducer';
import { useCosmWasmClientContext } from '../../contexts/CosmWasmClient';
import { useSigningCosmWasmClientContext } from '../../contexts/SigningCosmWasmClient';
import { useIdentityContext } from '../../contexts/IdentityContext';
import { BalanceDisplay } from './components/Balance';
import { BasicForm } from './Proposal/Components/BasicForm';
import { UpdateDirectories } from './Proposal/Components/UpdateDirectories';
import {
  DaoMultisigClient,
  DaoMultisigQueryClient,
} from '../../client/DaoMultisig.client';
import { SpendDaoFunds } from './Proposal/Components/SpendDaoFunds';

import { DaoMembersClient } from '../../client/DaoMembers.client';
import { validateForm } from './Proposal/libs/checkIfFormValid';
import { getRequest } from './Proposal/libs/getRequest';
import { useDaoMultisigProposeMutation } from '../../client/DaoMultisig.react-query';
import { useLeaveConfirm } from '../../hooks/useLeaveConfirm';
import { useRouter } from 'next/router';
import { useDaoMultisigListVotersQuery } from '../../client/DaoMultisig.react-query';
import { v4 as uuid } from 'uuid';

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

export type ProposalTypes = 'text' | 'update-directories' | 'spend-dao-funds';
export const proposalTypes: Record<ProposalTypes, string> = {
  text: 'Text',
  'update-directories': 'Update  Directors',
  'spend-dao-funds': 'Spend DAO Funds',
};
const proposalTypesArr = Object.entries(proposalTypes) as [
  ProposalTypes,
  string,
][];

const initId = uuid();
const initialState: State = {
  ownerId: '',
  title: {
    value: '',
    error: '',
  },
  description: {
    value: '',
    error: '',
  },
  threshold: {
    value: '0',
    error: '',
  },
  members: {},
  spends: {
    [initId]: {
      id: initId,
      amount: 0,
      name: '',
    },
  },
  balance: {
    jmes: '',
  },
};

export const DAOProposalPage = ({
  setCreateDaoSelected,
  daoAddress,
  selectedDaoName,
}: {
  daoOwner: { name: string; address: string; votingPower: number };
  // eslint-disable-next-line @typescript-eslint/ban-types
  setCreateDaoSelected: Function;
  identityName: string;
  daoAddress: string;
  selectedDaoName: string;
}) => {
  const { address } = useIdentityContext();
  const [err, setErr] = useState<string[] | undefined>([]);
  const [creatingProposal, setIsCreatingProposal] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { cosmWasmClient } = useCosmWasmClientContext();
  const { signingCosmWasmClient: signingClient } =
    useSigningCosmWasmClientContext();
  const [activeTab, setActiveTab] = useState<ProposalTypes>('text');
  const [state, dispatch] = useReducer(DAOProposalReducer, initialState);
  const { title, description } = state;

  const client: IdentityserviceQueryClient = useMemo(
    () =>
      new IdentityserviceQueryClient(
        cosmWasmClient as CosmWasmClient,
        IDENTITY_SERVICE_CONTRACT,
      ),
    [cosmWasmClient],
  );

  const isDirty = useMemo(() => {
    const { title, description, members, spends } = state;
    if (title.value || description.value) {
      return true;
    }
    if (Object.values(members).some(el => el.isRemoved || !el.og)) {
      return true;
    }
    if (
      Object.values(spends).length <= 1 &&
      Object.values(spends).some(el => el.amount || el.address)
    ) {
      return true;
    }
  }, [state]);

  useLeaveConfirm({
    preventNavigatingAway: !!isDirty,
  });

  const daoMultisigQueryClient = useMemo(
    () =>
      new DaoMultisigQueryClient(
        cosmWasmClient as CosmWasmClient,
        daoAddress as string,
      ),
    [cosmWasmClient, daoAddress],
  );

  const daoMember = useMemo(
    () =>
      new DaoMembersClient(
        signingClient as SigningCosmWasmClient,
        address as string,
        IDENTITY_SERVICE_CONTRACT,
      ),
    [address, signingClient],
  );

  const daoClient = useMemo(
    () =>
      new DaoMultisigClient(
        signingClient as SigningCosmWasmClient,
        address as string,
        IDENTITY_SERVICE_CONTRACT,
      ),
    [address, signingClient],
  );

  const createGovProposalMutation = useDaoMultisigProposeMutation();

  useEffect(() => {
    async function getThreshold() {
      try {
        const threshold = await daoMultisigQueryClient.threshold();
        let percentage = '0';
        if ('threshold_quorum' in threshold) {
          percentage = (
            Number(threshold.threshold_quorum.threshold) * 100
          ).toFixed(0);
        }
        if ('absolute_count' in threshold) {
          percentage = Number(threshold.absolute_count.weight).toFixed(0);
        }
        if ('absolute_percentage' in threshold) {
          percentage = (
            Number(threshold.absolute_percentage.percentage) * 100
          ).toFixed(0);
        }
        dispatch({
          type: 'SET_INPUT_VALUE',
          payload: {
            type: 'threshold',
            value: percentage,
          },
        });
      } catch (err) {
        console.error('Error:', err);
      }
    }
    getThreshold();
  }, [daoMultisigQueryClient, dispatch]);

  const membersArr = useMemo(
    () => Object.values(state.members).filter(el => !el.isRemoved),
    [state.members],
  );

  const { data, isLoading, isFetching } = useDaoMultisigListVotersQuery({
    client: daoMultisigQueryClient,
    args: {},
  });

  useEffect(() => {
    async function getMemberFromVoters() {
      const members: Member[] = [];
      if (!data || membersArr.length > 0) {
        return members;
      }

      for (const voter of data.voters) {
        const ownerId = await client.getIdentityByOwner({
          owner: voter.addr,
        });
        members.push({
          id: uuid(),
          name: ownerId.identity?.name ?? '',
          votingPower: voter.weight,
        });
      }

      !membersArr.length &&
        dispatch({
          type: 'ADD_MEMBERS',
          payload: members,
        });
    }

    getMemberFromVoters();
  }, [client, data, dispatch, membersArr.length]);

  const totalVotingPower = useMemo(() => {
    let votingPowers = 0;
    membersArr.forEach(el => {
      if (!el.votingPower) {
        return;
      }
      votingPowers += el.votingPower;
    });
    return votingPowers;
  }, [membersArr]);

  const error = useMemo(() => {
    return validateForm(state, activeTab);
  }, [state, activeTab]);

  return (
    <Box>
      <Flex mb={'26px'}>
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
          Create DAO Proposal
        </Text>
      </Flex>
      <BalanceDisplay address={daoAddress ?? ''} />
      <Flex flexGrow={1} width={'full'} height={'26px'} />
      <Flex flexGrow={1} width="full">
        <Box marginRight="44px">
          <Text
            color={'rgba(15,0,86,0.8)'}
            fontWeight="medium"
            fontSize={12}
            fontFamily="DM Sans"
            marginBottom={'17px'}
          >
            SELECT PROPOSAL TYPE
          </Text>
          {proposalTypesArr.map(([key, value]) => (
            <ProposalType
              label={value}
              key={key}
              type={key}
              isActive={key === activeTab}
              onClick={() => setActiveTab(key)}
            />
          ))}
        </Box>
        <Flex direction="column" width="full">
          <BasicForm
            titleError={title.error}
            title={title.value}
            description={description.value}
            descriptionError={description.error}
            dispatch={dispatch}
          />
          {activeTab === 'update-directories' && (
            <UpdateDirectories
              totalVotingPower={totalVotingPower}
              membersArr={membersArr}
              isLoading={isFetching || isLoading}
              client={client}
              state={state}
              dispatch={dispatch}
            />
          )}
          {activeTab === 'spend-dao-funds' && (
            <SpendDaoFunds client={client} state={state} dispatch={dispatch} />
          )}
        </Flex>
      </Flex>
      <Flex flexDir="column">
        {err?.map(el => (
          <Text color="red" key={el}>
            {el}
          </Text>
        ))}
      </Flex>
      <Box marginLeft={'270px'}>
        <Flex
          marginTop={'12px'}
          marginBottom={'93px'}
          height={'48px'}
          alignItems={'center'}
          width={'100%'}
        >
          <Spacer />
          <Button
            width={'99px'}
            height={'42px'}
            variant={'link'}
            onClick={() => setCreateDaoSelected(false)}
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
            disabled={creatingProposal || !!error.length}
            onClick={async () => {
              let result = null;
              try {
                if (error.length) {
                  setErr(error);
                  return;
                }
                setErr([]);
                setIsCreatingProposal(true);
                const msg = getRequest(state, activeTab);
                if (msg && 'propose' in msg) {
                  result = await daoClient.propose(msg.propose);
                }
                if (msg && 'update_members' in msg) {
                  result = await daoMember.updateMembers(msg.update_members);
                }
                if (!msg) {
                  result = await createGovProposalMutation.mutateAsync({
                    client: daoClient,
                    msg: {
                      title: state.title.value,
                      description: state.description.value,
                      msgs: [],
                    },
                  });
                }
                if (!result) {
                  throw new Error('Something went wrong');
                }
                const id =
                  result.events
                    .find(el => el.type === 'wasm')
                    ?.attributes.find(el => el.key === 'proposal_id')?.value ??
                  null;
                toast({
                  title: 'Created Dao Proposal',
                });
                dispatch({
                  type: 'RESET',
                  payload: initialState,
                });
                router.push(`/dao/view/${selectedDaoName}/proposals/${id}`);
              } catch (err) {
                if (err instanceof Error) {
                  toast({
                    status: 'error',
                    title: err.message,
                  });
                }
              }
              setIsCreatingProposal(false);
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
            {!creatingProposal ? (
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
    </Box>
  );
};
