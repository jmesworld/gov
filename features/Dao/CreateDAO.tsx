import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState, useReducer, useCallback } from 'react';

import { AddIcon } from '@chakra-ui/icons';
import {
  IdentityserviceClient,
  IdentityserviceQueryClient,
} from '../../client/Identityservice.client';
import { useChain } from '@cosmos-kit/react';
import { chainName } from '../../config/defaults';
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';
import { useIdentityserviceRegisterDaoMutation } from '../../client/Identityservice.react-query';
import { StdFee } from '@cosmjs/amino';
import { useCosmWasmClientContext } from '../../contexts/CosmWasmClient';
import { useSigningCosmWasmClientContext } from '../../contexts/SigningCosmWasmClient';
import { Reducer, State } from './createDAOReducer';
import { v4 as uuid } from 'uuid';
import { useLeaveConfirm } from '../../hooks/useLeaveConfirm';
import { useDAOContext } from '../../contexts/DAOContext';
import { MemberUpdate } from './Proposal/Components/DaoMembersEdit';
import { useBalanceContext } from '../../contexts/balanceContext';
import { AutoDistributeAsInt } from '../../utils/autoDistribute';
import { DaoName } from '../Dao/components/DaoName';

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

const fee: StdFee = {
  amount: [{ amount: '30000', denom: 'ujmes' }],
  gas: '10000000',
};

const defaultThreshold = 100;
const initialState: State = {
  ownerId: '',
  members: {},
  daoName: '',
  threshold: defaultThreshold,
};

const leaveModalTitle =
  'Are you sure you want to leave the creation of this Proposal?';
const leaveModalMessage = 'All data will be lost.';
const CreateDaoNewForm = ({
  setCreateDaoSelected,
  daoOwner,
}: {
  setCreateDaoSelected: (address: string) => void;
  daoOwner: { name: string; address: string; votingPower: number };
}) => {
  const { refresh } = useBalanceContext();
  const { setAfterCreate } = useDAOContext();
  const { signingCosmWasmClient: signingClient } =
    useSigningCosmWasmClientContext();
  const [isCreatingDao, setIsCreatingDao] = useState(false);
  const { address } = useChain(chainName);
  const { cosmWasmClient } = useCosmWasmClientContext();
  const toast = useToast();
  const [{ daoName, threshold, ownerId, members, daoNameError }, dispatch] =
    useReducer(Reducer, initialState);

  const isDirty = useMemo(() => {
    return (
      daoName !== '' ||
      threshold !== defaultThreshold ||
      Object.values(members).length > 1
    );
  }, [daoName, members, threshold]);

  const [setRouterCheck, navigate] = useLeaveConfirm({
    preventNavigatingAway: isDirty && !isCreatingDao,
    title: leaveModalTitle,
    message: leaveModalMessage,
  });

  const membersArr = useMemo(() => Object.values(members), [members]);

  useEffect(() => {
    if (Object.keys(members).length !== 0) {
      return;
    }
    const id = uuid();
    dispatch({
      type: 'SET_OWNER_ID',
      payload: id,
    });
    dispatch({
      type: 'ADD_MEMBER',
      payload: {
        id,
        name: daoOwner.name,
        address: daoOwner.address,
        votingPower: 100,
      },
    });
  }, [daoOwner, members]);

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

  const client: IdentityserviceQueryClient = useMemo(
    () =>
      new IdentityserviceQueryClient(
        cosmWasmClient as CosmWasmClient,
        IDENTITY_SERVICE_CONTRACT,
      ),
    [cosmWasmClient],
  );

  const idClient: IdentityserviceClient = new IdentityserviceClient(
    signingClient as SigningCosmWasmClient,
    address as string,
    IDENTITY_SERVICE_CONTRACT,
  );

  const registerDaoMutation = useIdentityserviceRegisterDaoMutation();

  const duplicateNames = useMemo(() => {
    const originalLength = membersArr.length;
    const memberSet = new Set(Object.keys(membersArr));
    return originalLength !== memberSet.size;
  }, [membersArr]);

  const onVotingPowerChange = useCallback(
    (id: string, value: number) => {
      dispatch({
        type: 'SET_VALUE',
        payload: {
          id,
          votingPower: value,
        },
      });
    },
    [dispatch],
  );

  const onNameChange = useCallback(
    (id: string, value: string) => {
      // CHECK if error exist or same name exist
      const nameInArr = membersArr.find(el => el.name === value);
      dispatch({
        type: 'SET_VALUE',
        payload: {
          id,
          name: value,
          error: nameInArr ? 'Name already exists' : undefined,
        },
      });
    },
    [membersArr],
  );
  const onAddress = useCallback(
    (id: string, value?: string | null) => {
      // TODO: move this to reducer
      const member = membersArr.find(el => el.id === id);
      const addressInArr = membersArr.find(
        el => el.address === value && el.id !== id,
      );

      dispatch({
        type: 'SET_VALUE',
        payload: {
          id,
          address: value,
          error:
            addressInArr &&
            member?.name === addressInArr.name &&
            addressInArr.error === undefined
              ? 'Address already exists'
              : undefined,
        },
      });
    },
    [membersArr],
  );
  const onErrorChange = useCallback(
    (id: string, error?: string) => {
      dispatch({
        type: 'SET_VALUE',
        payload: {
          id,
          error: error,
        },
      });
    },
    [dispatch],
  );
  const onRemove = useCallback(
    (id: string) => {
      dispatch({
        type: 'REMOVE_MEMBER',
        payload: id,
      });
    },
    [dispatch],
  );

  const formHasErrors = useMemo(() => {
    if (!daoName) {
      return true;
    }
    if (!threshold) {
      return true;
    }
    if (duplicateNames) {
      return true;
    }
    if (daoNameError) {
      return true;
    }
    let thereIsError = false;
    membersArr.forEach(member => {
      if (thereIsError) {
        return;
      }
      if (
        !member.address ||
        !member.name ||
        !member.votingPower ||
        member.error
      ) {
        thereIsError = true;
      }
    });
    return thereIsError || totalVotingPower < 100 || totalVotingPower > 100;
  }, [
    daoName,
    daoNameError,
    duplicateNames,
    membersArr,
    threshold,
    totalVotingPower,
  ]);
  return (
    <Box width={'100%'} pb="4">
      <Box width="70%">
        <Box marginTop={'35px'}>
          <Text
            color={'purple'}
            fontWeight="normal"
            fontFamily="DM Sans"
            fontSize={28}
            marginBottom={'40px'}
          >
            Create DAO
          </Text>
          <Text
            color={'rgba(15,0,86,0.8)'}
            fontFamily="DM Sans"
            fontSize={12}
            fontWeight="medium"
            marginBottom={'17px'}
          >
            DAO NAME
          </Text>
          <DaoName
            daoName={daoName}
            daoNameError={daoNameError}
            dispatch={dispatch}
            client={client}
          />
          <Text
            height="10px"
            color="red"
            marginBottom={'8px'}
            fontFamily={'DM Sans'}
            fontWeight="normal"
            fontSize={12}
            marginTop={'8px'}
          >
            {daoNameError}
          </Text>
          <Flex width="100%" marginTop={'40px'} marginBottom={'23px'}>
            <Flex width="85%">
              <Button
                variant={'outline'}
                borderColor={'purple'}
                width={'126px'}
                height={'48px'}
                onClick={() => {
                  dispatch({
                    type: 'ADD_MEMBER',
                    payload: {
                      id: uuid(),
                      name: '',
                      votingPower: 0,
                    },
                  });
                }}
                borderRadius={50}
                backgroundColor={'transparent'}
                _hover={{ bg: 'transparent' }}
                justifyContent={'start'}
              >
                <Flex marginLeft={'0px'} alignItems={'center'}>
                  <AddIcon boxSize={'10px'} color="#7453FD" />
                  <Text
                    color="purple"
                    fontWeight="medium"
                    fontSize={14}
                    marginLeft={'10px'}
                    fontFamily="DM Sans"
                  >
                    Director
                  </Text>
                </Flex>
              </Button>
              <Box width={'8px'} />
              <Button
                variant={'outline'}
                borderColor={'purple'}
                width={'126px'}
                height={'48px'}
                onClick={() => {
                  const power = AutoDistributeAsInt(100, membersArr.length);
                  membersArr.forEach((member, i) => {
                    dispatch({
                      type: 'SET_VALUE',
                      payload: {
                        id: member.id,
                        votingPower: power[i] ?? 0,
                      },
                    });
                  });
                }}
                borderRadius={50}
                backgroundColor={'transparent'}
                _hover={{ bg: 'transparent' }}
                justifyContent={'center'}
              >
                <Text
                  color="purple"
                  fontWeight="medium"
                  fontSize={14}
                  fontFamily="DM Sans"
                >
                  Auto Distribute
                </Text>
              </Button>
            </Flex>
            <Flex width="13%">
              <Text
                color={'rgba(15,0,86,0.8)'}
                fontFamily="DM Sans"
                fontSize={12}
                pl="5px"
                fontWeight="medium"
                marginBottom={'17px'}
                alignSelf={'center'}
              >
                SHARE OF VOTES
              </Text>
            </Flex>
          </Flex>
          {membersArr.map(daoMember => (
            <MemberUpdate
              isReadOnly={daoMember.id === ownerId}
              key={daoMember.id}
              id={daoMember.id}
              name={daoMember.name}
              address={daoMember.address}
              error={daoMember.error}
              votingPower={daoMember.votingPower}
              client={client}
              onVotingPowerChange={onVotingPowerChange}
              onNameChange={onNameChange}
              onAddress={onAddress}
              onErrorChange={onErrorChange}
              onRemove={onRemove}
            />
          ))}
          <Flex
            marginTop={'16px'}
            height={'48px'}
            alignItems={'center'}
            width={'100%%'}
            justifyContent="space-between"
          >
            <Flex
              flexDir="column"
              alignItems="flex-end"
              justifyContent="flex-end"
              width={'100%'}
              mt="10px"
            >
              <InputGroup
                pl="8px"
                flexWrap="wrap"
                width={'13%'}
                height={'48px'}
              >
                <Input
                  variant={'outline'}
                  width={'100%'}
                  height={'100%'}
                  textAlign="center"
                  borderColor={'primary.500'}
                  background={totalVotingPower === 100 ? 'purple' : 'red'}
                  focusBorderColor="darkPurple"
                  borderRadius={12}
                  color={'white'}
                  fontWeight={'normal'}
                  value={totalVotingPower}
                />

                <InputRightElement width="30%" height={'100%'}>
                  <Text
                    mr="20px"
                    textAlign="left"
                    color={'purple'}
                    fontFamily="DM Sans"
                    fontSize={16}
                    fontWeight="normal"
                    textColor="white"
                  >
                    %
                  </Text>
                </InputRightElement>
              </InputGroup>

              <Text
                color="red"
                fontFamily="DM Sans"
                fontSize={12}
                height={'16px'}
                pt="5px"
                fontWeight="normal"
                marginLeft={'12px'}
              >
                {totalVotingPower !== 100 &&
                  'Total Share of Votes must equal 100%'}
              </Text>
            </Flex>
            <Flex width="29px" />
          </Flex>
          <Text
            marginBottom={'8px'}
            color={'red'}
            fontFamily={'DM Sans'}
            fontWeight="normal"
            fontSize={18}
            marginLeft={'12px'}
            marginTop={'8px'}
          >
            {duplicateNames && 'Single member identity entered more than once!'}
          </Text>
          <Flex width="96%" flexDir="column">
            <Text
              marginTop={'93px'}
              color={'rgba(15,0,86,0.8)'}
              fontFamily="DM Sans"
              fontSize={12}
              fontWeight="medium"
              marginBottom={'8px'}
            >
              % TO PASS
            </Text>
            <Slider
              aria-label="dao-proposal-threshold"
              defaultValue={threshold}
              value={threshold}
              width={'100%'}
              onChange={val =>
                dispatch({
                  type: 'SET_THRESHOLD',
                  payload: val,
                })
              }
              min={1}
              max={100}
              step={1}
            >
              <SliderTrack
                height={'16px'}
                borderRadius={'10px'}
                backgroundColor={'primary.100'}
                borderColor={'primary.500'}
                borderWidth={'1px'}
              >
                <SliderFilledTrack backgroundColor={'green'} />
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
                    {threshold}%
                  </Text>
                </Box>
              </SliderThumb>
            </Slider>
          </Flex>
        </Box>
      </Box>
      <Flex
        marginTop={'12px'}
        marginBottom={'43px'}
        height={'48px'}
        alignItems={'center'}
        width={'100%'}
      >
        <Spacer />
        <Button
          width={'99px'}
          height={'42px'}
          variant={'link'}
          onClick={() => {
            setCreateDaoSelected('');
            navigate('/');
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
          disabled={formHasErrors}
          onClick={() => {
            setIsCreatingDao(true);
            registerDaoMutation
              .mutateAsync({
                client: idClient,
                msg: {
                  daoName: daoName.trim(),
                  maxVotingPeriod: {
                    time: 2419200, //28 days
                  },
                  members: membersArr.map(el => ({
                    addr: el.address as string,
                    weight: el.votingPower as number,
                  })),
                  thresholdPercentage: threshold,
                },
                args: { fee },
              })
              .then(() => {
                const ownerMember: State['members'] = {
                  [ownerId]: {
                    id: ownerId,
                    name: daoOwner.name,
                    address: daoOwner.address,
                    votingPower: 0,
                  },
                };
                setRouterCheck(false);
                dispatch({
                  type: 'RESET',
                  payload: {
                    ...initialState,
                    members: ownerMember,
                    ownerId,
                  },
                });
              })
              .then(() => {
                refresh();
                toast({
                  title: 'Dao created.',
                  description:
                    "We've created your Dao for you. You'll be able to access it shortly.",
                  status: 'success',
                  duration: 9000,
                  isClosable: true,
                  containerStyle: {
                    backgroundColor: 'darkPurple',
                    borderRadius: 12,
                  },
                });

                setAfterCreate('afterCreate');
                navigate(`/dao/view/${daoName.trim()}`);
              })
              .catch(error => {
                toast({
                  title: 'Dao creation error',
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
                setIsCreatingDao(false);
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
          {!isCreatingDao ? (
            <Text
              color="midnight"
              fontFamily={'DM Sans'}
              fontWeight="medium"
              fontSize={14}
            >
              Create
            </Text>
          ) : (
            <CircularProgress isIndeterminate size={'24px'} color="midnight" />
          )}
        </Button>
      </Flex>
    </Box>
  );
};

export default CreateDaoNewForm;
