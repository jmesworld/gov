import { getGovProposalType } from '../../../../utils/proposalUti';
import { ProposalType } from '../../../components/Proposal/ProposalType';
import { ProposalResponseForEmpty } from '../../../../client/DaoMultisig.types';
import { Flex, Text } from '@chakra-ui/react';
import { formatString } from '../../../../lib/strings';

type Props = {
  proposal?: ProposalResponseForEmpty;
};

export const GovProposalType = ({ proposal }: Props) => {
  if (!proposal) return null;
  const { proposalType } = getGovProposalType(proposal);

  if (!proposalType) return null;
  return (
    <div>
      <ProposalType
        fullWidth
        mb="0px"
        type={proposalType}
        proposalDetail
        isActive={false}
      />
    </div>
  );
};

export const GetProposalDetail = ({ proposal }: Props) => {
  if (!proposal) return null;
  const { excuteMsg } = getGovProposalType(proposal);
  if (!excuteMsg) return null;

  if ('core_slot' in excuteMsg.propose) {
    const brand = excuteMsg.propose.core_slot.slot;
    const slotType = Object.keys(brand)[0];
    return (
      <Flex
        background="rgba(112, 79, 247, 0.1)"
        borderRadius="12px"
        border="1px solid rgba(112, 79, 247, 0.5)"
        padding="14px 16px"
        width="100%"
        display="flex"
        alignItems="center"
        px="20px"
        my="10px"
        borderWidth={1}
        borderStyle="solid"
        height={'48px'}
        color={'purple'}
      >
        <Text color="purple">Slot Type:</Text>
        <Text ml="15px">{formatString(slotType)}</Text>
      </Flex>
    );
  }

  if ('request_feature' in excuteMsg.propose) {
    const featureType = excuteMsg.propose.request_feature.feature.art_dealer
      ? 'art_dealer'
      : '';
    const NFTTomMint =
      excuteMsg.propose.request_feature.feature.art_dealer.approved;
    return (
      <Flex
        background="rgba(112, 79, 247, 0.1)"
        borderRadius="12px"
        border="1px solid rgba(112, 79, 247, 0.5)"
        padding="14px 16px"
        width="100%"
        display="flex"
        alignItems="center"
        px="20px"
        my="10px"
        borderWidth={1}
        borderStyle="solid"
        height={'48px'}
        color={'purple'}
      >
        <Text color="purple" fontSize="12px" fontWeight="bold">
          Feature Type:
        </Text>
        <Text ml="15px" color="midnight">
          {formatString(featureType)}
        </Text>
        <Text ml="15px" fontSize="12px" fontWeight="bold">
          Number of NFT&apos;s to Mint:
        </Text>
        <Text ml="5px" color="midnight">
          {NFTTomMint}
        </Text>
      </Flex>
    );
  }
  return null;
};
