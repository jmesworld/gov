import { useCallback, useMemo } from 'react';
import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { MemberUpdate } from './DaoMembersEdit';
import { IdentityserviceQueryClient } from '../../../../client/Identityservice.client';

type Props = {
  remove: string[];
  client: IdentityserviceQueryClient;
  add: {
    addr: string;
    weight: number;
  }[];
};

export const UpdateDirectoriesList = ({ client, add, remove }: Props) => {
  const totalVotingPower = useMemo(() => {
    return add.reduce((acc, curr) => acc + curr.weight, 0);
  }, [add]);
  const emptyFn = useCallback(() => {}, []);
  return (
    <Flex flexDir="column" mt="4">
      <Flex>
        <Flex width={'85%'}>
          <Text
            mb="4"
            textTransform="uppercase"
            fontSize={'12px'}
            fontFamily="DM Sans"
          >
            Directors
          </Text>
        </Flex>
        <Flex pl="10px" width={'15%'}>
          <Text
            mb="4"
            textTransform="uppercase"
            fontSize={'12px'}
            fontFamily="DM Sans"
          >
            SHARE OF VOTES
          </Text>
        </Flex>
      </Flex>

      {add.map(daoMember => (
        <MemberUpdate
          removeCopy
          isReadOnly
          fetchName
          key={daoMember.addr}
          id={daoMember.addr}
          address={daoMember.addr}
          name={daoMember.addr}
          votingPower={daoMember.weight}
          client={client}
          onVotingPowerChange={emptyFn}
          onNameChange={emptyFn}
          onAddress={emptyFn}
          onErrorChange={emptyFn}
          onRemove={emptyFn}
          nonClosable
        />
      ))}
      {remove.map(daoMember => (
        <MemberUpdate
          removeCopy
          fetchName
          isReadOnly
          key={daoMember}
          id={daoMember}
          address={daoMember}
          name={daoMember}
          votingPower={0}
          client={client}
          onVotingPowerChange={emptyFn}
          onNameChange={emptyFn}
          onAddress={emptyFn}
          onErrorChange={emptyFn}
          onRemove={emptyFn}
          nonClosable
        />
      ))}
      <Flex
        marginTop={'16px'}
        height={'48px'}
        alignItems={'center'}
        width={'100%'}
      >
        <Flex width={'85%'} />
        <Flex width={'15%'}>
          <InputGroup paddingLeft={'10px'} width={'full'} height={'48px'}>
            <Input
              variant={'outline'}
              width={'100%'}
              height={'100%'}
              borderColor={'background.500'}
              background={totalVotingPower === 100 ? 'purple' : 'red'}
              focusBorderColor="darkPurple"
              borderRadius={12}
              color={'white'}
              fontWeight={'normal'}
              value={totalVotingPower}
            />

            <InputRightElement
              width="30%"
              display="flex"
              justifyContent="center"
              height={'100%'}
            >
              <Text
                color={'white'}
                fontFamily="DM Sans"
                fontSize={16}
                marginRight={'24px'}
                fontWeight="normal"
              >
                %
              </Text>
            </InputRightElement>
          </InputGroup>
        </Flex>
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
          backgroundColor={'background.100'}
          borderColor={'background.500'}
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
