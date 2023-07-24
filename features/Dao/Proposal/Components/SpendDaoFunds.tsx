import { Dispatch, useCallback, useMemo } from 'react';
import { State, Actions } from '../../DaoProposalReducer';
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import { AddIcon } from '@chakra-ui/icons';
import { IdentityserviceQueryClient } from '../../../../client/Identityservice.client';
import { DaoTransferFund } from './DaoTransferFund';

type Props = {
  state: State;
  dispatch: Dispatch<Actions>;
  client: IdentityserviceQueryClient;
};

export const SpendDaoFunds = ({ client, state, dispatch }: Props) => {
  const spendArr = useMemo(() => Object.values(state.spends), [state.spends]);

  const totalAmount = useMemo(() => {
    let votingPowers = 0;
    spendArr.forEach(el => {
      if (!el.amount) {
        return;
      }
      votingPowers += el.amount;
    });
    return votingPowers;
  }, [spendArr]);

  const onAmountChange = useCallback(
    (id: string, value: number | '') => {
      dispatch({
        type: 'SET_SPEND_VALUE',
        payload: {
          id,
          amount: value,
        },
      });
    },
    [dispatch],
  );
  const onNameChange = useCallback(
    (id: string, value: string) => {
      dispatch({
        type: 'SET_SPEND_VALUE',
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
        type: 'SET_SPEND_VALUE',
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
        type: 'SET_SPEND_VALUE',
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
        type: 'REMOVE_SPEND',
        payload: id,
      });
    },
    [dispatch],
  );

  return (
    <Flex flexDir="column">
      <Flex width={'798px'} marginTop={'10px'} marginBottom={'25px'}>
        <Button
          variant={'outline'}
          borderColor={'purple'}
          width={'200px'}
          height={'48px'}
          onClick={() => {
            dispatch({
              type: 'Add_SPEND',
              payload: {
                id: uuid(),
                name: '',
                amount: 0,
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
              Add Receiver address
            </Text>
          </Flex>
        </Button>
        <Box width={'8px'} />

        <Spacer />
      </Flex>

      {spendArr.map(spend => (
        <DaoTransferFund
          notCancelable={spendArr.length === 1}
          key={spend.id}
          id={spend.id}
          name={spend.name}
          address={spend.address}
          error={spend.error}
          amount={spend.amount}
          client={client}
          onAmountChange={onAmountChange}
          onNameChange={onNameChange}
          onAddress={onAddress}
          onErrorChange={onErrorChange}
          onRemove={onRemove}
        />
      ))}
      <Flex
        marginTop={'16px'}
        height={'14px'}
        alignItems={'center'}
        width={'100%'}
        justifyContent="flex-end"
      >
        <Box width={'202px'} height={'18px'}>
          <Text fontSize={12}>TOTAL</Text>
        </Box>
      </Flex>
      <Flex
        marginTop={'16px'}
        height={'48px'}
        alignItems={'center'}
        width={'100%'}
        justifyContent="flex-end"
      >
        <InputGroup width={'202px'} height={'48px'} marginRight={'34px'}>
          <Input
            variant={'outline'}
            width={'202px'}
            height={'100%'}
            borderColor={'primary.500'}
            background={totalAmount > 0 ? 'purple' : 'red'}
            focusBorderColor="darkPurple"
            borderRadius={12}
            color={'white'}
            fontWeight={'normal'}
            value={totalAmount}
          />

          <InputLeftElement height={'100%'}>
            <Image
              src="/JMES_Icon_white.svg"
              alt="JMES Icon"
              width={4}
              height={4}
            />
          </InputLeftElement>
        </InputGroup>
      </Flex>
    </Flex>
  );
};
