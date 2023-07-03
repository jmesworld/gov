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

import { AddIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
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
import { Reducer } from './createDAOReducer';
import { v4 as uuid } from 'uuid';
import { Member } from './components/DaoMember';
import { z } from 'zod';

const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

const fee: StdFee = {
  amount: [{ amount: '30000', denom: 'ujmes' }],
  gas: '10000000',
};

const DEFAULT_DAO_THRESHOLD = 100; // 100% threshold by default

const CreateDaoNewForm = ({
  setCreateDaoSelected,
  daoOwner,
}: {
  setCreateDaoSelected: (address: string) => void;
  daoOwner: { name: string; address: string; votingPower: number };
}) => {
  const { signingCosmWasmClient: signingClient } =
    useSigningCosmWasmClientContext();
  const { address } = useChain(chainName);
  const { cosmWasmClient } = useCosmWasmClientContext();
  const toast = useToast();
  const [{ daoName, threshold, ownerId, members, daoNameError }, dispatch] =
    useReducer(Reducer, {
      members: {},
      ownerId: '',
      daoName: '',
      threshold: 0,
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
        votingPower: 0,
      },
    });
  }, [daoOwner, members]);

  const [isCreatingDao, setIsCreatingDao] = useState(false);
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
  }, [daoNameError, duplicateNames, membersArr, threshold, totalVotingPower]);
  return (
    <Box marginTop={'35px'}>
      <Text
        color={'purple'}
        fontWeight="normal"
        fontFamily="DM Sans"
        fontSize={28}
        marginBottom={'60px'}
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
      <Input
        spellCheck="false"
        variant={'outline'}
        width={'798px'}
        height={'48px'}
        borderColor={'primary.500'}
        background={'primary.100'}
        focusBorderColor="darkPurple"
        borderRadius={12}
        color={'purple'}
        onChange={e => {
          const value = e.target.value;
          const name = z
            .string()
            .min(2, {
              message: 'Name must have at least 1 character',
            })
            .max(20, {
              message: 'Name must have at most is 20 character',
            })
            .safeParse(value);
          dispatch({
            type: 'SET_DAO_NAME',
            payload: {
              value,
              error: name.success
                ? undefined
                : name.error.format()._errors.join('\n'),
            },
          });
        }}
      />
      <Text
        height="10px"
        color="red"
        marginBottom={'8px'}
        fontFamily={'DM Sans'}
        fontWeight="normal"
        fontSize={12}
        marginLeft={'18px'}
        marginTop={'8px'}
      >
        {daoNameError}
      </Text>
      <Flex width={'798px'} marginTop={'38px'} marginBottom={'19px'}>
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
            const power = 100 / Object.keys(members).length;
            membersArr.forEach(member => {
              dispatch({
                type: 'SET_VALUE',
                payload: {
                  id: member.id,
                  votingPower: power,
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
        <Spacer />
        <Text
          color={'rgba(15,0,86,0.8)'}
          fontFamily="DM Sans"
          fontSize={12}
          fontWeight="medium"
          marginBottom={'17px'}
          marginRight={'50px'}
          alignSelf={'center'}
        >
          SHARE OF VOTES
        </Text>
      </Flex>
      {membersArr.map(daoMember => (
        <Member
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
        width={'798px'}
      >
        <QuestionOutlineIcon
          width={'16px'}
          height={'16px'}
          color={'rgba(0,0,0,0.4)'}
        />
        <Text
          color={'rgba(0,0,0,0.7)'}
          fontFamily="DM Sans"
          fontSize={14}
          fontWeight="normal"
          marginLeft={'12px'}
        >
          Total Share of Votes must equal 100%
        </Text>
        <Spacer />
        <InputGroup width={'102px'} height={'48px'} marginRight={'44px'}>
          <Input
            variant={'outline'}
            width={'102px'}
            height={'100%'}
            borderColor={'primary.500'}
            background={totalVotingPower === 100 ? 'purple' : 'red'}
            focusBorderColor="darkPurple"
            borderRadius={12}
            color={'white'}
            fontWeight={'normal'}
            value={totalVotingPower}
          />

          <InputRightElement height={'100%'}>
            <Text
              color={'white'}
              fontFamily="DM Sans"
              fontSize={16}
              fontWeight="normal"
            >
              %
            </Text>
          </InputRightElement>
        </InputGroup>
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
        defaultValue={DEFAULT_DAO_THRESHOLD}
        width={'722px'}
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
        <SliderThumb height={'32px'} position={'relative'}>
          <Box
            height="30px"
            width="55px"
            background="#7453FD"
            position="absolute"
            bottom="calc(100% + 15px)"
            left="50%"
            transform="translateX(-50%)"
            borderRadius={12}
            boxShadow="0px 3.5px 5.5px rgba(0, 0, 0, 0.02)"
            _after={{
              content: '""',
              borderTop: '13px solid #7453FD',
              borderLeft: '7.5px solid transparent',
              borderRight: '7.5px solid transparent',
              position: 'absolute',
              top: 'calc(100% - 1px)',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Text
              color="#FFFFFF"
              fontFamily={'DM Sans'}
              fontWeight="400"
              fontSize={14}
              lineHeight="12px"
              textAlign="center"
              marginTop="9px"
            >
              {`${threshold} %`}
            </Text>
          </Box>
        </SliderThumb>
      </Slider>
      <Flex
        marginTop={'12px'}
        marginBottom={'93px'}
        height={'48px'}
        alignItems={'center'}
        width={'100%'}
      >
        <QuestionOutlineIcon
          width={'16px'}
          height={'16px'}
          color={'rgba(0,0,0,0.4)'}
        />
        <Text
          color={'rgba(0,0,0,0.7)'}
          fontFamily="DM Sans"
          fontSize={14}
          fontWeight="normal"
          marginLeft={'12px'}
        >
          Individual Share of Votes must not exceed % to Pass
        </Text>
        <Spacer />
        <Button
          width={'99px'}
          height={'42px'}
          variant={'link'}
          onClick={() => setCreateDaoSelected('')}
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
              .finally(() => setIsCreatingDao(false));
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
