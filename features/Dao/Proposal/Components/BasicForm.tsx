import { Dispatch } from 'react';
import { Actions } from '../../DaoProposalReducer';
import { Box, Input, Text, Textarea } from '@chakra-ui/react';
import {
  proposalDescriptionValidator,
  proposalTitleValidator,
} from '../../../../utils/proposalValidate';
import { InputStyled } from '../../../components/common/Input';
import { TextareaStyled } from '../../../components/common/textarea';

type Props = {
  title: string;
  titleError?: string;
  description: string;
  descriptionError?: string;
  dispatch: Dispatch<Actions>;
};

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
      <InputStyled
        height={'48px'}
        isInvalid={!!titleError}
        value={title}
        onChange={e => {
          const nameValidation = proposalTitleValidator.safeParse(
            e.target.value,
          );
          dispatch({
            type: 'SET_INPUT_VALUE',
            payload: {
              type: 'title',
              value: e.target.value,
              error: nameValidation.success
                ? undefined
                : nameValidation.error.errors[0].message,
            },
          });
        }}
        placeholder={'Title'}
      />
      <Text fontSize="xs" mt="2" height="15px" color="red">
        {titleError}
      </Text>

      <Box height={'12px'} />
      <TextareaStyled
        height={'320px'}
        value={description}
        isInvalid={!!descriptionError}
        onChange={e => {
          const descriptionValidation = proposalDescriptionValidator.safeParse(
            e.target.value,
          );
          dispatch({
            type: 'SET_INPUT_VALUE',
            payload: {
              type: 'description',
              value: e.target.value,
              error: descriptionValidation.success
                ? undefined
                : descriptionValidation.error.errors[0].message,
            },
          });
        }}
        placeholder={'Description'}
      />
      <Text fontSize="xs" mt="2" height="15px" color="red">
        {descriptionError}
      </Text>
    </Box>
  );
};
