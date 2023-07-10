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
}: {
  label?: string;
  type: string;
  isActive: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  mb?: string;
  proposalDetail?: boolean;
  fullWidth?: boolean;
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
      cursor={'pointer'}
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
      >
        {label || getLabel(type)} {proposalDetail ? 'Proposal' : ''}
      </Text>
      <Spacer />
      {isActive ? <CheckIcon color={'green'} /> : ''}
    </Flex>
  );
};

const getLabel = (type: string) => {
  switch (type) {
    case 'text':
      return 'Text';
    case 'core-slot':
      return 'Core Slot';
    case 'revoke-proposal':
      return 'Revoke';
    case 'improvement':
      return 'Improvement';
    case 'spend-funds':
      return 'spend-funds';
    case 'feature-request':
      return 'Feature Request';
    default:
      return type;
  }
};

const getImgSrc = (type: string) => {
  switch (type) {
    case 'text':
      return '/Text_Type.svg';
    case 'update-directories':
      return '/update-directories.svg';
    case 'core-slot':
      return '/CoreSlot_Type.svg';
    case 'revoke-proposal':
      return '/RevokeCoreSlot_Type.svg';
    case 'improvement':
      return '/Improvement_Type.svg';
    case 'spend-dao-funds':
      return '/Spend_key.svg';
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
    case 'core-slot':
      return '31px';
    case 'revoke-core-slot':
      return '27px';
    case 'improvement':
      return '24.74px';
    default:
      return '';
  }
};
