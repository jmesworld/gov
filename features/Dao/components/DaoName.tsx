import React, { Dispatch, useEffect } from 'react';
import { Flex, Input } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { Actions } from '../createDAOReducer';
import { useDebounce } from '../../../hooks/useDebounce';
import { IdentityserviceQueryClient } from '../../../client/Identityservice.client';
import { daoNameSchema } from '../../../utils/dao';
import { allowedCharacters } from '../../../utils/numberValidators';

const nameSchemaForEachChar = z.string().regex(/^[a-z0-9]+$/);
const capitalNameSchema = z.string().regex(/^[A-Z]+$/);

type Props = {
  daoName: string;
  daoNameError?: string | null;
  dispatch: Dispatch<Actions>;
  client: IdentityserviceQueryClient;
  disabled?: boolean;
};
export const DaoName = ({
  daoName,
  dispatch,
  daoNameError,
  client,
  disabled,
}: Props) => {
  const daoNameDebounced = useDebounce({
    value: daoName,
    delay: 300,
  });

  const { data } = useQuery({
    enabled:
      (daoNameDebounced === daoName &&
        daoNameDebounced !== '' &&
        !daoNameError) ||
      disabled,
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
        errorBorderColor="red"
        focusBorderColor={daoNameError ? 'red' : 'darkPurple'}
        value={daoName}
        borderRadius={12}
        color={'purple'}
        onKeyDown={e => {
          const { key } = e;
          if (allowedCharacters.includes(key)) {
            return;
          }
          const name = nameSchemaForEachChar.safeParse(key);
          const capitalName = capitalNameSchema.safeParse(key);
          if (capitalName.success) {
            // fire with lowercase
            e.preventDefault();
            dispatch({
              type: 'SET_DAO_NAME',
              payload: {
                value: daoName + key.toLowerCase(),
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

          const name = daoNameSchema.safeParse(value);
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
