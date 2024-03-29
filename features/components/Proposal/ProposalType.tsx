import { CheckIcon } from '@chakra-ui/icons';
import { Flex, Image, Spacer, Text } from '@chakra-ui/react';
import { MouseEventHandler } from 'react';

export const ProposalType = ({
  type,
  isActive,
  onClick,
  label,
  mb = '14px',
  proposalDetail = false,
  fullWidth = false,
  daoName,
}: {
  label?: string;
  type: string;
  isActive: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  mb?: string;
  proposalDetail?: boolean;
  fullWidth?: boolean;
  daoName?: string;
}) => {
  return (
    <Flex
      width={fullWidth ? '100%' : '220px'}
      height={'48px'}
      borderRadius={'12px'}
      alignItems={'center'}
      paddingLeft={'10.16PX'}
      paddingRight={'12PX'}
      backgroundColor={isActive ? 'darkPurple' : 'purple'}
      cursor={onClick ? 'pointer' : 'auto'}
      onClick={onClick}
      mb={mb ?? 0}
    >
      <Image
        src={getImgSrc(type)}
        alt="icon"
        width={getImgSrcWidth(type)}
        height={getImgSrcHeight(type)}
        justifySelf={'center'}
      />
      <Text
        color={'white'}
        fontWeight="medium"
        fontSize={14}
        fontFamily="DM Sans"
        marginLeft={'10px'}
        display={'flex'}
        opacity={daoName ? 0.7 : 1}
        alignItems={'center'}
      >
        {label || getLabelForProposalTypes(type)}
        {proposalDetail ? ' Proposal' : ''}
      </Text>
      {daoName && (
        <Text
          color={'white'}
          fontWeight="medium"
          fontSize={14}
          fontFamily="DM Sans"
          marginLeft={'10px'}
        >
          by {daoName}
        </Text>
      )}
      <Spacer />
      {isActive ? <CheckIcon color={'green'} /> : ''}
    </Flex>
  );
};

export const getLabelForProposalTypes = (type: string) => {
  switch (type) {
    case 'text':
      return 'Text';
    case 'core-slot':
    case 'core_slot':
      return 'Core Slot';
    case 'revoke-proposal':
    case 'revoke_proposal':
      return 'Revoke Core Slot';
    case 'improvement':
      return 'Improvement';
    case 'spend-funds':
    case 'spend_funds':
      return 'Spend funds';
    case 'feature-request':
    case 'feature_request':
      return 'Feature Request';

    case 'update_directors':
      return 'Update Directors';
    default:
      return type;
  }
};

const getImgSrc = (type: string) => {
  switch (type) {
    case 'text':
      return '/Text_Type.svg';
    case 'update_directors':
    case 'update-directories':
      return '/update-directories.svg';
    case 'core_slot':
    case 'core-slot':
      return '/CoreSlot_Type.svg';
    case 'revoke_proposal':
    case 'revoke-proposal':
      return '/RevokeCoreSlot_Type.svg';
    case 'improvement':
      return '/Improvement_Type.svg';
    case 'spend_funds':
    case 'spend-dao-funds':
      return '/Spend_Key.svg';
    case 'feature_request':
    case 'feature-request':
      return '/feature_request.svg';
    default:
      return '';
  }
};

const getImgSrcWidth = (type: string) => {
  switch (type) {
    case 'text':
      return '32.84px';
    case 'core-slot':
      return '29px';
    case 'revoke-core-slot':
      return '27px';
    case 'improvement':
      return '29.59px';
    default:
      return '';
  }
};

export const getImgSrcHeight = (type: string) => {
  switch (type) {
    case 'text':
      return '18.01px';
    case 'core_slot':
    case 'core-slot':
      return '31px';
    case 'revoke_proposal':
    case 'revoke-proposal':
    case 'revoke-core-slot':
      return '27px';
    case 'improvement':
      return '24.74px';
    default:
      return '';
  }
};
