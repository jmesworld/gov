import { Dispatch } from 'react';
import { Actions } from '../../DaoProposalReducer';
import { Box, Input, Text, Textarea } from '@chakra-ui/react';
import { z } from 'zod';

type Props = {
  title: string;
  titleError?: string;
  description: string;
  descriptionError?: string;
  dispatch: Dispatch<Actions>;
};
const nameSchema = z
  .string()
  .min(2, {
    message: 'Name must have at least 1 character',
  })
  .max(200, {
    message: 'Name exceed 200 character limit',
  });

const descriptionSchema = z
  .string()
  .min(2, {
    message: 'Description must have at least 1 character',
  })
  .max(2000, {
    message: 'Name exceed 2000 character limit',
  });

export const BasicForm = ({
  title,
  titleError,
  descriptionError,
  description,
  dispatch,
}: Props) => {
  return (
    <Box>
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
        height={'48px'}
        borderColor={'primary.500'}
        background={'primary.100'}
        focusBorderColor="darkPurple"
        borderRadius={12}
        value={title}
        color={'purple'}
        onChange={e => {
          const nameValidation = nameSchema.safeParse(e.target.value);
          dispatch({
            type: 'SET_INPUT_VALUE',
            payload: {
              type: 'title',
              value: e.target.value,
              error: nameValidation.success
                ? undefined
                : nameValidation.error.format()._errors.join('\n'),
            },
          });
        }}
        placeholder={'Title:'}
      />
      <Text fontSize="sm" height="15px" color="red">
        {titleError}
      </Text>

      <Box height={'12px'} />
      <Textarea
        variant={'outline'}
        width={'full'}
        height={'320px'}
        value={description}
        borderColor={'primary.500'}
        background={'primary.100'}
        focusBorderColor="darkPurple"
        borderRadius={12}
        color={'purple'}
        onChange={e => {
          const descriptionValidation = descriptionSchema.safeParse(
            e.target.value,
          );
          dispatch({
            type: 'SET_INPUT_VALUE',
            payload: {
              type: 'description',
              value: e.target.value,
              error: descriptionValidation.success
                ? undefined
                : descriptionValidation.error.format()._errors.join('\n'),
            },
          });
        }}
        placeholder={'Description:'}
      />
      <Text fontSize="sm" height="15px" color="red">
        {descriptionError}
      </Text>
    </Box>
  );
};
