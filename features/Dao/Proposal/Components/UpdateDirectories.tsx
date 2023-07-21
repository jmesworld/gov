import { Dispatch, useCallback } from 'react';
import { State, Actions, Member } from '../../DaoProposalReducer';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { AddIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { MemberUpdate } from './DaoMembersEdit';
import { IdentityserviceQueryClient } from '../../../../client/Identityservice.client';
import { AutoDistributeAsInt } from '../../../../utils/autoDistribute';

type Props = {
  state: State;
  dispatch: Dispatch<Actions>;
  client: IdentityserviceQueryClient;
  membersArr: Member[];
  isLoading: boolean;
  totalVotingPower: number;
};

export const UpdateDirectories = ({
  membersArr,
  isLoading,
  client,
  totalVotingPower,
  dispatch,
}: Props) => {
  const onVotingPowerChange = useCallback(
    (id: string, value: number | '') => {
      dispatch({
        type: 'SET_MEMBER_VALUE',
        payload: {
          id,
          votingPower: value === '' ? undefined : value,
        },
      });
    },
    [dispatch],
  );
  const onNameChange = useCallback(
    (id: string, value: string) => {
      dispatch({
        type: 'SET_MEMBER_VALUE',
        payload: {
          id,
          name: value,
        },
      });
    },
    [dispatch],
  );

  const onAddress = useCallback(
    (id: string, value?: string | null) => {
      dispatch({
        type: 'SET_MEMBER_VALUE',
        payload: {
          id,
          address: value,
        },
      });
    },
    [dispatch],
  );
  const onErrorChange = useCallback(
    (id: string, error?: string) => {
      dispatch({
        type: 'SET_MEMBER_VALUE',
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

  return (
    <Flex flexDir="column">
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
            const power = AutoDistributeAsInt(100, membersArr.length);
            membersArr.forEach((member, i) => {
              dispatch({
                type: 'SET_MEMBER_VALUE',
                payload: {
                  id: member.id,
                  name: member.name,
                  votingPower: power[i],
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
      </Flex>
      {isLoading && <Spinner />}
      {membersArr.map(daoMember => (
        <MemberUpdate
          removeCopy
          isReadOnly={false}
          key={daoMember.id}
          id={daoMember.id}
          name={daoMember.name}
          address={daoMember.address}
          error={daoMember.error}
          votingPower={
            daoMember.votingPower === '' ? undefined : daoMember.votingPower
          }
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
        width={'100%'}
      >
        <Flex width={'85%'} />
        <Flex width={'13%'}>
          <InputGroup paddingLeft={'10px'} width={'full'} height={'48px'}>
            <Input
              variant={'outline'}
              width={'100%'}
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
        <Flex marginLeft="5px" width={'24px'} />
      </Flex>
      {/* <Text
        marginTop={'73px'}
        color={'rgba(15,0,86,0.8)'}
        fontFamily="DM Sans"
        fontSize={12}
        fontWeight="medium"
        marginBottom={'8px'}
      >
        % TO PASS
      </Text> */}
      {/* <Slider
        aria-label="dao-proposal-threshold"
        value={Number(state.threshold.value) || 0}
        defaultValue={Number(state.threshold.value) || 0}
        width={'722px'}
        onChange={val =>
          dispatch({
            type: 'SET_INPUT_VALUE',
            payload: {
              type: 'threshold',
              value: String(val),
            },
          })
        }
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
        <Tooltip
          isOpen
          hasArrow={true}
          label={`${state.threshold.value} %`}
          bg={'purple'}
          color={'white'}
          direction={'rtl'}
          placement={'top'}
          borderRadius={'10px'}
        >
          <SliderThumb height={'32px'} />
        </Tooltip>
      </Slider> */}
      {/* <Flex
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
          Individual Share of Votes must not exceed % to Pass.
        </Text>

        <Spacer />
      </Flex> */}
    </Flex>
  );
};
