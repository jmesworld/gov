import {
  getDaoProposalType,
  getGovProposalType,
} from '../../../../utils/proposalUti';
import { ProposalType } from '../../../components/Proposal/ProposalType';
import { ProposalResponseForEmpty } from '../../../../client/DaoMultisig.types';
import {
  Box,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { formatString } from '../../../../lib/strings';
import { getFormattedSlotType } from '../../../../utils/coreSlotType';
import { DaoTransferFund } from './DaoTransferFund';
import { IdentityserviceQueryClient } from '../../../../client/Identityservice.client';
import { UpdateDirectoriesList } from './UpdateDirectorsComponent';

type Props = {
  proposal?: ProposalResponseForEmpty;
  client: IdentityserviceQueryClient;
};

export const GovProposalType = ({ proposal }: Props) => {
  if (!proposal) return null;
  const { proposalType } = getGovProposalType(proposal);
  const daoProposalType = getDaoProposalType(proposal);
  if (!proposalType && !daoProposalType) return null;
  return (
    <div>
      <ProposalType
        fullWidth
        mb="0px"
        type={proposalType || daoProposalType || ''}
        proposalDetail
        isActive={false}
      />
    </div>
  );
};

export const getSlotType = ({ proposal }: Omit<Props, 'client'>) => {
  if (!proposal) return null;
  let slotType: null | string = null;
  const { excuteMsg } = getGovProposalType(proposal);
  if (!excuteMsg || !excuteMsg.propose) return null;

  if ('core_slot' in excuteMsg.propose) {
    const brand = excuteMsg.propose.core_slot.slot;
    slotType = Object.keys(brand)[0];
  }
  return getFormattedSlotType(slotType ?? undefined);
};

type UpdateMember = {
  add: Array<{
    weight: number;
    addr: string;
  }>;

  remove: Array<string>;
};

export const GetProposalDetail = ({ proposal, client }: Props) => {
  if (!proposal) return null;
  const { excuteMsg, bankMsg } = getGovProposalType(proposal);

  if (excuteMsg && 'update_members' in excuteMsg) {
    if (
      !('remove' in (excuteMsg.update_members as UpdateMember)) ||
      !('add' in (excuteMsg.update_members as UpdateMember))
    ) {
      return null;
    }
    return (
      <UpdateDirectoriesList
        client={client}
        add={(excuteMsg.update_members as UpdateMember)?.add}
        remove={(excuteMsg.update_members as UpdateMember)?.remove}
      />
    );
  }

  if (bankMsg) {
    let total = 0;
    const SpendFunds = bankMsg.map((msg, i) => {
      if (!('send' in msg)) {
        return null;
      }
      const amountInUjmes = msg.send.amount.reduce(
        (a, b) => a + Number(b.amount),
        0,
      );
      total += amountInUjmes;
      const address = msg.send.to_address;
      return (
        <DaoTransferFund
          client={client}
          readonly
          id={String(i)}
          key={i}
          name=""
          address={address}
          amount={amountInUjmes / 1e6}
        />
      );
    });

    return (
      <Flex mt="20px" flexDir="column">
        <Flex mb="15px">
          <Text display="flex" flex="1" fontSize="12px">
            RECEIVERS
          </Text>
          <Text width="202px" fontSize={'12px'} color="midnight">
            AMOUNT
          </Text>
        </Flex>
        {SpendFunds}

        <Flex
          marginTop={'16px'}
          height={'14px'}
          alignItems={'center'}
          width={'100%'}
          justifyContent="flex-end"
        >
          <Box width={'202px'} height={'18px'}>
            <Text color="midnight" fontSize={12}>
              TOTAL
            </Text>
          </Box>
        </Flex>
        <Flex
          marginTop={'16px'}
          height={'48px'}
          alignItems={'center'}
          width={'100%'}
          justifyContent="flex-end"
        >
          <InputGroup width={'202px'} height={'48px'}>
            <Input
              variant={'outline'}
              width={'202px'}
              height={'100%'}
              borderColor={'background.500'}
              background={total / 1e6 > 0 ? 'purple' : 'red'}
              focusBorderColor="darkPurple"
              borderRadius={12}
              color={'white'}
              fontWeight={'normal'}
              value={total / 1e6}
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
  }

  if (!excuteMsg || !excuteMsg.propose) return null;
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
        <Text ml="15px">{getFormattedSlotType(slotType)}</Text>
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
        <Text
          fontFamily={'DM Sans'}
          color="purple"
          fontSize="15px"
          fontWeight="bold"
        >
          Feature Type:
        </Text>
        <Text fontFamily={'DM Sans'} ml="15px" color="purple">
          {formatString(featureType)}
        </Text>
        <Text
          fontFamily={'DM Sans'}
          ml="30px"
          fontSize="15px"
          fontWeight="bold"
        >
          Number of NFT&apos;s to Mint:
        </Text>
        <Text fontFamily={'DM Sans'} ml="5px" color="purple">
          {NFTTomMint}
        </Text>
      </Flex>
    );
  }
  return null;
};
