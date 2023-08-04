import { useMemo } from 'react';
import { ProposalResponse } from '../../client/Governance.types';
import { ProposalType } from '../components/Proposal/ProposalType';
import { getProposalTypeForGovPublicProposals } from '../../utils/proposalUti';
import { Flex, Text } from '@chakra-ui/react';
import { getFormattedSlotType } from '../../utils/coreSlotType';

type Props = {
  proposal?: ProposalResponse;
  daoName?: string;
};
export const GovProposalType = ({ proposal, daoName }: Props) => {
  const type = useMemo(() => {
    if (!proposal) return null;
    return getProposalTypeForGovPublicProposals(proposal);
  }, [proposal]);
  if (!proposal) return null;

  return (
    <ProposalType
      fullWidth
      mb="0px"
      type={type ?? ''}
      proposalDetail
      daoName={daoName}
      isActive={false}
    />
  );
};

export const GetSlotType = ({ proposal }: Omit<Props, 'daoName'>) => {
  const type = useMemo(() => {
    if (!proposal) return null;
    return getProposalTypeForGovPublicProposals(proposal);
  }, [proposal]);

  if (type !== 'core_slot') return null;

  const slotType = Object.keys(
    (proposal?.prop_type as { core_slot: object })?.core_slot,
  )[0];

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
      <Text ml="15px">{getFormattedSlotType(slotType)}</Text>
    </Flex>
  );
};
