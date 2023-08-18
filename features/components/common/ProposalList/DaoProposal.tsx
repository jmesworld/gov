// TD: [proposalList](3) - needs to be refactored
/* eslint-disable @typescript-eslint/ban-types */
import { Badge, Box, Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import { useMemo } from 'react';
import { ProposalProgress } from '../../Proposal/ProposalProgress';
import {
  getDaoProposalType,
  getGovProposalType,
} from '../../../../utils/proposalUti';
import { GovernanceQueryClient } from '../../../../client/Governance.client';
import { ProposalResponseForEmpty } from '../../../../client/DaoMultisig.types';
import { formatBalanceWithComma } from '../../../../hooks/useAccountBalance';
import { useDaoMultisigListVotesQuery } from '../../../../client/DaoMultisig.react-query';
import { DaoMultisigQueryClient } from '../../../../client/DaoMultisig.client';
import { getLabelForProposalTypes } from '../../Proposal/ProposalType';
import { getSlotType } from '../../../Dao/Proposal/Components/ProposalType';
import {
  getDaoProposalFundingDetail,
  getDaoProposalTarget,
  getVotingProgress,
} from '../../../../utils/daoProposalUtil';

type Props = {
  proposals: ProposalResponseForEmpty[];
  onClickListItem?: (proposalId: number) => void;
  client: GovernanceQueryClient;
  daoClient?: DaoMultisigQueryClient;
  isAllInactive?: boolean;
  daoAddress: string;
};

export const DaoProposalList = ({
  proposals,
  onClickListItem,
  client,
  daoClient,
  isAllInactive,
  daoAddress,
}: Props) => {
  return (
    <Flex display="grid" gap="3">
      {proposals.length === 0 && (
        <Flex justifyContent="center" width="100%">
          <Text
            color="rgba(15,0,86,0.8)"
            fontFamily={'DM Sans'}
            fontWeight="normal"
            fontStyle={'italic'}
            fontSize={14}
            marginTop={'24px'}
          >
            Currently no Proposals available to view
          </Text>
        </Flex>
      )}
      {proposals?.map(proposal => (
        <DaoProposal
          key={proposal.id}
          isAllInactive={isAllInactive}
          onClickListItem={onClickListItem}
          proposal={proposal}
          client={client}
          daoClient={daoClient}
          daoAddress={daoAddress}
        />
      ))}
    </Flex>
  );
};

const DaoProposal = ({
  proposal,
  daoClient,
  daoAddress,
  isAllInactive,
  onClickListItem,
}: {
  proposal: ProposalResponseForEmpty;
  client: GovernanceQueryClient;
  daoClient?: DaoMultisigQueryClient;
  daoAddress: string;
  onClickListItem?: (proposalId: number) => void;
  isAllInactive?: boolean;
}) => {
  const { fundingPerMonth, votingDuration } =
    getDaoProposalFundingDetail(proposal);

  const slotType = getSlotType({ proposal });
  const propsalType = getGovProposalType(proposal);
  const daoProposalType = getDaoProposalType(proposal);
  const target = getDaoProposalTarget(proposal);

  const votesQuery = useDaoMultisigListVotesQuery({
    client: daoClient,
    args: { proposalId: Number(proposal.id) || 0 },
    options: {
      refetchInterval: 10000,
      enabled: !!daoAddress,
    },
  });

  const yesPercentage = useMemo(() => {
    return (
      votesQuery?.data?.votes.reduce((acc, vote) => {
        if (vote.vote === 'yes') {
          return acc + vote.weight;
        }
        return acc;
      }, 0) ?? 0
    );
  }, [votesQuery?.data?.votes]);

  const noPercentage = useMemo(() => {
    return (
      votesQuery?.data?.votes.reduce((acc, vote) => {
        if (vote.vote === 'no') {
          return acc + vote.weight;
        }
        return acc;
      }, 0) ?? 0
    );
  }, [votesQuery?.data?.votes]);

  const votingDetail = useMemo(() => {
    return getVotingProgress(
      proposal.status,
      yesPercentage,
      noPercentage,
      target,
    );
  }, [proposal.status, yesPercentage, noPercentage, target]);
  return (
    <DaoProposalListItem
      inActive={!!isAllInactive}
      labelColor={votingDetail.color ?? undefined}
      labelText={votingDetail.label ?? undefined}
      fundingDuration={votingDuration ?? '-'}
      fundingPerMonth={fundingPerMonth !== null ? String(fundingPerMonth) : '-'}
      key={proposal.id}
      title={proposal.title}
      target={target}
      type={
        propsalType.proposalType
          ? `${getLabelForProposalTypes(propsalType.proposalType)}${
              slotType ? ` - ${slotType}` : ''
            }`
          : daoProposalType
          ? `${getLabelForProposalTypes(daoProposalType)}${
              slotType ? ` - ${slotType}` : ''
            }`
          : ''
      }
      onClickListItem={() => {
        onClickListItem && onClickListItem(proposal.id);
      }}
      yesPercentage={yesPercentage}
      noPercentage={noPercentage}
    />
  );
};

export const ProposalHeader = ({
  isGov,
  proposalTitle,
  minWidth,
  funding,
}: {
  isGov: boolean;
  proposalTitle?: string;
  minWidth?: string;
  funding?: boolean;
}) => {
  const minWidthGov = isGov ? '1000px' : '800px';
  return (
    <Flex flex={1} minWidth={minWidth || minWidthGov} width="100%">
      <Flex width={isGov ? '70%' : '70%'}>
        <Box width="30%">
          <Text
            color="rgba(15,0,86,0.8)"
            fontWeight="medium"
            fontFamily="DM Sans"
            fontSize={12}
          >
            {proposalTitle}
            {!proposalTitle && isGov && ' PROPOSALS'}
            {!proposalTitle && !isGov && 'DAO PROPOSALS'}
          </Text>
        </Box>
        <Box width={'70%'}></Box>
      </Flex>
      {(funding || isGov) && (
        <>
          <Box width={funding ? '12%' : '15%'}>
            <Text
              color="rgba(15,0,86,0.8)"
              fontFamily={'DM Sans'}
              fontWeight="medium"
              fontSize={12}
              width="full"
              whiteSpace="pre"
              overflow="hidden"
              textOverflow="ellipsis"
              title="FUNDING P/M"
            >
              FUNDING P/M
            </Text>
          </Box>
          <Flex width={funding ? '15%' : '15%'}>
            <Text
              color="rgba(15,0,86,0.8)"
              fontFamily={'DM Sans'}
              fontWeight="medium"
              fontSize={12}
              textAlign={'left'}
              width="full"
              whiteSpace="pre"
              overflow="hidden"
              textOverflow="ellipsis"
              title="FUNDING DURATION"
            >
              FUNDING DURATION
            </Text>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export const DaoProposalListItem = ({
  title,
  type,
  onClickListItem,
  fundingDuration,
  inActive,
  fundingPerMonth,
  target,
  yesPercentage,
  noPercentage,
  labelColor,
  labelText,
}: {
  title: string;
  type: string;
  onClickListItem?: () => void;
  inActive?: boolean;
  fundingPerMonth?: string;
  fundingDuration?: string;
  labelText?: string;
  labelColor?: string;

  target: number;
  yesPercentage: number;
  noPercentage: number;
}) => {
  return (
    <>
      <Flex
        minWidth={'800px'}
        opacity={inActive ? '0.5' : '1'}
        flex={1}
        height={'89px'}
        width={'100%'}
        backgroundColor="purple"
        borderRadius={12}
        alignItems={'center'}
        onClick={() => {
          onClickListItem && onClickListItem();
        }}
        cursor={'pointer'}
      >
        <Flex width={'70%'}>
          <Flex
            flexWrap="wrap"
            width={'30%'}
            flexDirection={'column'}
            justifyContent={'center'}
          >
            <Flex alignItems="center" px="4" w="full">
              <Flex flexDir="column" alignItems="center" w="full">
                <Tooltip hasArrow isDisabled={title.length < 20} label={title}>
                  <Text
                    color="white"
                    fontFamily={'DM Sans'}
                    fontWeight="normal"
                    fontSize={18}
                    width={'100%'}
                    wordBreak="break-all"
                    noOfLines={1}
                    textOverflow="ellipsis"
                  >
                    {title}
                  </Text>
                </Tooltip>
                <Flex w="100%">
                  <Text
                    width="268px"
                    color="white"
                    fontFamily={'DM Sans'}
                    fontWeight="normal"
                    fontSize={14}
                    opacity={'70%'}
                  >
                    {type}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            width={'70%'}
            pr="6"
            alignItems={'center'}
            justifyContent={'space-around'}
          >
            <ProposalProgress
              targetPercentage={target}
              yesCount={yesPercentage}
              noCount={noPercentage}
              noPercent={noPercentage}
              yesPercent={yesPercentage}
              target={target}
            />
          </Flex>
        </Flex>

        <>
          <Flex width="12%" alignItems="center" justifyContent="flex-start">
            {fundingPerMonth === undefined && (
              <Text
                color="white"
                fontWeight="normal"
                fontSize={14}
                fontFamily="DM Sans"
              >
                -
              </Text>
            )}
            {fundingPerMonth !== undefined && (
              <Tooltip
                zIndex={333}
                label={formatBalanceWithComma(
                  Number(fundingPerMonth ?? 0) || 0,
                )}
                isDisabled={fundingPerMonth === undefined}
                hasArrow
              >
                <Flex alignItems="center">
                  {!isNaN(Number(fundingPerMonth)) && (
                    <Image
                      src="/JMES_Icon_white.svg"
                      alt="JMES Icon"
                      width={'9px'}
                      mr="1"
                      height={'10.98px'}
                    />
                  )}
                  <Text
                    color="white"
                    fontWeight="normal"
                    fontSize={14}
                    fontFamily="DM Sans"
                    noOfLines={1}
                    textOverflow="ellipsis"
                  >
                    {isNaN(Number(fundingPerMonth)) && fundingPerMonth}
                    {!isNaN(Number(fundingPerMonth)) &&
                      formatBalanceWithComma(
                        Number(fundingPerMonth ?? 0) || 0,
                        1,
                        0,
                      )}
                  </Text>
                </Flex>
              </Tooltip>
            )}
          </Flex>
          <Box width="18%" justifyContent={'center'}>
            <Flex pr="3" justifyContent="space-between">
              <Text
                color="white"
                fontWeight="normal"
                fontSize={14}
                fontFamily="DM Sans"
                noOfLines={1}
              >
                {fundingDuration}
              </Text>

              {labelColor && labelText && (
                <Badge
                  alignItems="center"
                  display="flex"
                  fontWeight="normal"
                  color="black"
                  rounded="full"
                  px="2"
                  bg={labelColor}
                  fontSize="10px"
                  textAlign="center"
                >
                  {labelText}
                </Badge>
              )}
            </Flex>
          </Box>
        </>
      </Flex>
    </>
  );
};
