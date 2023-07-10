import React, { Dispatch, useEffect } from 'react';
import { Flex, Input } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { Actions } from '../createDAOReducer';
import { useDebounce } from '../../../hooks/useDebounce';
import { IdentityserviceQueryClient } from '../../../client/Identityservice.client';

const nameSchema = z
  .string()
  .regex(/^[a-z]+$/, {
    message: 'Name must be lowercase and only contain letters and dashes',
  })
  .min(2, {
    message: 'Name must have at least 1 character',
  })
  .max(20, {
    message: 'Name must have at most is 20 character',
  });

const nameSchemaForEachChar = z.string().regex(/^[a-z]+$/);
const capitalNameSchema = z.string().regex(/^[A-Z]+$/);

type Props = {
  daoName: string;
  daoNameError?: string | null;
  dispatch: Dispatch<Actions>;
  client: IdentityserviceQueryClient;
};
export const DaoName = ({ daoName, dispatch, daoNameError, client }: Props) => {
  const daoNameDebounced = useDebounce({
    value: daoName,
    delay: 300,
  });

  const { data } = useQuery({
    enabled:
      daoNameDebounced === daoName && daoNameDebounced !== '' && !daoNameError,
    queryKey: ['members', daoNameDebounced],
    queryFn: ({ queryKey }) => client.getIdentityByName({ name: queryKey[1] }),
    retry: 1,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    if (daoNameDebounced !== daoName) {
      return;
    }
    dispatch({
      type: 'SET_DAO_NAME',
      payload: {
        value: daoName,
        error: data?.identity?.owner ? 'Name already exists' : undefined,
      },
    });
  }, [data, daoNameDebounced, daoName, dispatch]);

  useEffect(() => {
    if (!daoNameError) {
      return;
    }
  }, [daoNameError]);

  return (
    <Flex width="84%">
      <Input
        spellCheck="false"
        variant={'outline'}
        width="100%"
        height={'48px'}
        borderColor={'primary.500'}
        background={'primary.100'}
        focusBorderColor="darkPurple"
        value={daoName}
        borderRadius={12}
        color={'purple'}
        onKeyDown={e => {
          const character = e.key;
          if (character === 'Backspace') {
            return;
          }
          const name = nameSchemaForEachChar.safeParse(character);
          const capitalName = capitalNameSchema.safeParse(character);
          if (capitalName.success) {
            // fire with lowercase
            e.preventDefault();
            dispatch({
              type: 'SET_DAO_NAME',
              payload: {
                value: daoName + character.toLowerCase(),
                error: null,
              },
            });
          }

          if (!name.success) {
            e.preventDefault();
          }
        }}
        onChange={e => {
          const value = e.target.value;

          const name = nameSchema.safeParse(value);
          dispatch({
            type: 'SET_DAO_NAME',
            payload: {
              value,
              error: name.success
                ? undefined
                : (name.error.issues[0].message as string),
            },
          });
        }}
      />
    </Flex>
  );
};
