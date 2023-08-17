// TD: [proposalList](3) - needs to be refactored
/* eslint-disable @typescript-eslint/ban-types */
import {
  Badge,
  Box,
  Flex,
  Image,
  Progress,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { MouseEventHandler, useMemo } from 'react';
import { ProposalProgress } from './ProposalProgress';
import { useRouter } from 'next/router';
import { calculateVotes } from '../../../lib/calculateVotes';
import {
  getDaoProposalType,
  getFunding,
  getGovProposalType,
  isProposalGov,
} from '../../../utils/proposalUti';
import { GovernanceQueryClient } from '../../../client/Governance.client';
import { ProposalResponse } from '../../../client/Governance.types';
import { ProposalResponseForEmpty } from '../../../client/DaoMultisig.types';
import { formatBalanceWithComma } from '../../../hooks/useAccountBalance';
import { convertBlockToMonth } from '../../../utils/block';
import { useDaoMultisigListVotesQuery } from '../../../client/DaoMultisig.react-query';
import { DaoMultisigQueryClient } from '../../../client/DaoMultisig.client';
import { getLabelForProposalTypes } from './ProposalType';
import { getFormattedSlotType } from '../../../utils/coreSlotType';
import { getSlotType } from '../../Dao/Proposal/Components/ProposalType';
import { useDao } from '../../../hooks/dao';

type BaseProps = {
  totalSupply: number;
  proposals: ProposalResponse[] | ProposalResponseForEmpty[];
  onClickListItem?: MouseEventHandler<HTMLDivElement>;
  setSelectedDaoProposalTitle: Function;
  setSelectedProposalId: Function;
  client: GovernanceQueryClient;
  isGovList?: boolean;
  largeSize?: boolean;
  daoClient?: DaoMultisigQueryClient;
  goToDaoDetail?: boolean;
  isAllInactive?: boolean;
  showPassingOrFailing?: boolean;
  showPassedOrFailed?: boolean;
  tab?: string;
};
type Props =
  | (BaseProps & {
      isGov: false;
      daoAddress: string;
      daoName: string;
    })
  | (BaseProps & {
      isGov: true;
      daoAddress?: undefined;
      daoName?: undefined;
    });

export const ProposalList = ({
  proposals,
  daoName,
  onClickListItem,
  setSelectedDaoProposalTitle,
  setSelectedProposalId,
  totalSupply,
  client,
  isGovList,
  daoAddress,
  goToDaoDetail,
  daoClient,
  isAllInactive,
  showPassingOrFailing,
  showPassedOrFailed,
  tab,
}: Props) => {
  const router = useRouter();

  const navigateToProposal = (proposalId: string, isGov: boolean) => {
    if (isGov && !goToDaoDetail) {
      router.push(`/proposals/${proposalId}${tab ? `?tab=${tab}` : ''}`);
      return;
    }
    router.push(`/dao/view/${daoName}/proposals/${proposalId}`);
  };

  if (!proposals || !Array.isArray(proposals) || proposals.length === 0) {
    return (
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
    );
  } else {
    const proposalItems = proposals.map((proposal: any) => {
      const isGov = isProposalGov(proposal, client);

      if (isGovList && !goToDaoDetail) {
        let votingDuration = null;
        let votingDurationNum = null;
        if (proposal?.funding && proposal?.funding?.duration_in_blocks) {
          const duration = convertBlockToMonth(
            proposal?.funding?.duration_in_blocks,
          );
          votingDurationNum = duration.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          });
          votingDuration = `${votingDurationNum} month${
            duration !== 1 ? 's' : ''
          }`;
        }
        const {
          coinYes,
          coinNo,
          threshold,
          thresholdPercent,
          yesPercentage,
          noPercentage,
        } = calculateVotes({
          coin_Yes: proposal?.coins_yes,
          coin_no: proposal?.coins_no,
          totalSupply: (Number(proposal?.coins_total) || 0) / 1e6 ?? 0,
        });
        const propType = JSON.stringify(proposal?.prop_type)
          ?.split(':')?.[0]
          ?.slice(2);

        const type = propType
          ? propType.slice(0, propType.length - 1)
          : proposal.description;
        const coreSlot = proposal?.prop_type?.core_slot;
        let coreSlotType: string | null = null;
        if (coreSlot) {
          coreSlotType = Object.keys(coreSlot)?.[0];
        }
        const fundingPerMonth =
          proposal?.funding?.amount !== undefined
            ? Number(
                (proposal?.funding?.amount ?? 0) /
                  (Number(votingDurationNum) || 1),
              ) ?? 0
            : undefined;

        const statusSuccess = () => {
          if (
            proposal.status === 'success' ||
            proposal.status === 'success_concluded'
          ) {
            return true;
          }
          if (
            proposal.status === 'expired' ||
            proposal.status === 'expired_concluded'
          ) {
            return false;
          }
          return undefined;
        };

        const isPassing = () => {
          if (statusSuccess() !== undefined) {
            return undefined;
          }
          if (
            !showPassingOrFailing ||
            thresholdPercent === undefined ||
            yesPercentage === undefined
          ) {
            return undefined;
          }
          return thresholdPercent <= yesPercentage ? 'Passing' : 'Failing';
        };

        const hasPassed = () => {
          if (!showPassedOrFailed) {
            return undefined;
          }
          if (proposal.status === 'passed' || proposal.status === 'executed') {
            return 'Passed';
          }
          if (proposal.status === 'failed' || proposal.status === 'rejected') {
            return 'Failed';
          }
          return undefined;
        };
        return (
          <ProposalListItem
            daoId={proposal?.dao}
            fundingPerMonth={
              fundingPerMonth !== undefined
                ? String(fundingPerMonth)
                : undefined
            }
            inActive={isAllInactive}
            label={isPassing() || hasPassed()}
            labelSuccess={isPassing() === 'Passing' || hasPassed() === 'Passed'}
            votingDuration={votingDuration ?? '-'}
            key={proposal.id + proposal.description}
            title={proposal.title}
            yesCount={coinYes}
            passed={statusSuccess()}
            isGov={isGov}
            thresholdPercent={thresholdPercent}
            noCount={coinNo}
            yesPercent={yesPercentage}
            noPercent={noPercentage}
            totalCount={totalSupply}
            threshold={Number(threshold)}
            type={`${getLabelForProposalTypes(type)}${
              coreSlotType ? ` - ${getFormattedSlotType(coreSlotType)}` : ''
            } `}
            navigateToProposal={id => navigateToProposal(id, isGovList)}
            largeSize={isGovList ? true : false}
            daoAddress={undefined}
            proposalId={proposal.id}
            onClickListItem={onClickListItem}
            setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
            setSelectedDaoProposalId={setSelectedProposalId}
          />
        );
      }
      const fund = getFunding(proposal);
      let votingDuration: null | string = null;
      let votingDurationNum = null;
      let fundingPerMonth = null;
      if (fund?.duration_in_blocks) {
        const durationInBlock = Number(fund?.duration_in_blocks);
        const duration = convertBlockToMonth(durationInBlock);
        votingDurationNum = duration.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        });
        votingDuration = `${votingDurationNum} month${
          duration !== 1 ? 's' : ''
        }`;
      }

      if (fund?.amount) {
        fundingPerMonth =
          Number(fund?.amount || 0) / (Number(votingDurationNum) || 1);
      }

      const threshold = proposal.threshold?.absolute_count;
      const target = threshold ? threshold.weight : 0;
      const propsalType = getGovProposalType(proposal);
      const daoProposalType = getDaoProposalType(proposal);
      const slotType = getSlotType({ proposal });
      const hasPassed = () => {
        if (!showPassedOrFailed) {
          return undefined;
        }
        if (proposal.status === 'passed' || proposal.status === 'executed') {
          return 'Passed';
        }
        if (proposal.status === 'failed' || proposal.status === 'rejected') {
          return 'Failed';
        }
        return undefined;
      };

      return (
        <DaoProposalListItem
          showIsPassing={true}
          votingDuration={goToDaoDetail ? votingDuration || '-' : '-'}
          fundingPerMonth={goToDaoDetail ? String(fundingPerMonth) : '-'}
          key={proposal.id + proposal.description}
          title={proposal.title}
          daoClient={daoClient}
          totalCount={totalSupply}
          threshold={target}
          isGov={isGov}
          inActive={isAllInactive}
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
          navigateToProposal={id => navigateToProposal(id, !!isGovList)}
          largeSize={!!goToDaoDetail}
          label={hasPassed()}
          passed={
            hasPassed() !== undefined ? hasPassed() === 'Passed' : undefined
          }
          labelSuccess={
            proposal.status === 'passed' ||
            proposal.status === 'executed' ||
            hasPassed() === 'Passed'
          }
          daoAddress={daoAddress}
          proposalId={proposal.id}
          onClickListItem={onClickListItem}
          setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
          setSelectedDaoProposalId={setSelectedProposalId}
        />
      );
    });

    return (
      <Flex display="grid" gap="3">
        {proposalItems}
      </Flex>
    );
  }
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

// TODO: refactor this component to use the new ProposalListItem component
export const DaoProposalListItem = ({
  title,
  threshold,
  type,
  largeSize,
  proposalId,
  onClickListItem,
  setSelectedDaoProposalTitle,
  setSelectedDaoProposalId,
  navigateToProposal,
  votingDuration,
  inActive,
  fundingPerMonth,
  passed,
  daoAddress,
  daoClient,
  label,
  labelSuccess,
  showIsPassing,
}: {
  title: string;
  threshold: number;
  type: string;
  totalCount: number;
  largeSize: boolean;
  proposalId?: string;
  onClickListItem?: MouseEventHandler<HTMLDivElement>;
  setSelectedDaoProposalTitle: Function;
  setSelectedDaoProposalId: Function;
  navigateToProposal: (proposalId: string) => void;
  votingDuration?: string;
  isGov?: boolean;
  inActive?: boolean;
  fundingPerMonth?: string;
  passed?: boolean;
  daoClient?: DaoMultisigQueryClient;
  daoAddress?: string;
  label?: string;
  labelSuccess?: boolean;
  showIsPassing: boolean;
}) => {
  const votesQuery = useDaoMultisigListVotesQuery({
    client: daoClient,
    args: { proposalId: Number(proposalId) || 0 },
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

  const passing = useMemo(() => {
    if (!votesQuery.data || passed !== undefined) {
      return undefined;
    }
    if (showIsPassing) {
      return yesPercentage >= threshold ? 'Passing' : 'Failing';
    }
    return undefined;
  }, [votesQuery.data, passed, showIsPassing, yesPercentage, threshold]);

  const passingSuccess = useMemo(() => {
    return passing === 'Passing';
  }, [passing]);

  const labelColor = useMemo(() => {
    if (passed || passing === 'Passing') {
      return 'green';
    }
    if (passing === 'Failing') {
      return 'yellow';
    }
    if (passed === false) {
      return 'red';
    }
    return 'red';
  }, [passed, passing]);

  const labelText = useMemo(() => {
    if (passed || passing === 'Passing') {
      return 'Passed';
    }
    if (passing === 'Failing') {
      return 'Pending';
    }
    if (passed === false) {
      return 'Failed';
    }
    return 'Failed';
  }, [passed, passing]);

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
        onClick={e => {
          onClickListItem && onClickListItem(e);
          setSelectedDaoProposalTitle(title);
          setSelectedDaoProposalId(proposalId);
          navigateToProposal(proposalId as string);
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
                    width={largeSize ? '281px' : '268px'}
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
              targetPercentage={threshold}
              yesCount={yesPercentage}
              noCount={noPercentage}
              noPercent={noPercentage}
              yesPercent={yesPercentage}
              target={threshold}
            />
          </Flex>
        </Flex>

        <>
          <Flex width="12%" alignItems="center" justifyContent="flex-start">
            {!largeSize && (
              <Text
                color="white"
                fontWeight="normal"
                fontSize={14}
                fontFamily="DM Sans"
              >
                -
              </Text>
            )}
            {largeSize && fundingPerMonth !== undefined && (
              <Tooltip
                zIndex={333}
                label={formatBalanceWithComma(
                  Number(fundingPerMonth ?? 0) || 0,
                )}
                isDisabled={fundingPerMonth === undefined}
                hasArrow
              >
                <Flex alignItems="center">
                  <Image
                    src="/JMES_Icon_white.svg"
                    alt="JMES Icon"
                    width={'9px'}
                    mr="1"
                    height={'10.98px'}
                  />
                  <Text
                    color="white"
                    fontWeight="normal"
                    fontSize={14}
                    fontFamily="DM Sans"
                    noOfLines={1}
                    textOverflow="ellipsis"
                  >
                    {formatBalanceWithComma(
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
                {votingDuration}
              </Text>

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
            </Flex>
          </Box>
        </>
      </Flex>
    </>
  );
};

// TODO: refactor this component to use the new ProposalListItem component
export const ProposalListItem = ({
  title,
  yesCount,
  noCount,
  yesPercent,
  noPercent,
  threshold,
  thresholdPercent,
  type,
  largeSize,
  proposalId,
  onClickListItem,
  setSelectedDaoProposalTitle,
  setSelectedDaoProposalId,
  navigateToProposal,
  votingDuration,
  inActive,
  fundingPerMonth,
  passed,
  label,
  labelSuccess,
  daoId,
}: {
  title: string;
  threshold: number;
  type: string;
  yesCount: number;
  yesPercent: number;
  thresholdPercent: number;
  noCount: number;
  noPercent: number;
  totalCount: number;
  largeSize: boolean;
  daoAddress?: string;
  proposalId?: string;
  onClickListItem?: MouseEventHandler<HTMLDivElement>;
  setSelectedDaoProposalTitle: Function;
  setSelectedDaoProposalId: Function;
  navigateToProposal: (proposalId: string) => void;
  votingDuration?: string;
  isGov?: boolean;
  inActive?: boolean;
  fundingPerMonth?: string;
  passed?: boolean;
  label?: string;
  labelSuccess?: boolean;
  daoId?: string;
}) => {
  const { data: daoInfo } = useDao(daoId);
  const labelColor = useMemo(() => {
    if (passed || label === 'Passing') {
      return 'green';
    }
    if (label === 'Failing') {
      return 'yellow';
    }
    if (passed === false) {
      return 'red';
    }
    return 'red';
  }, [label, passed]);

  const labelText = useMemo(() => {
    if (label === 'Passing') {
      return 'Passing';
    }
    if (passed) {
      return 'Passed';
    }
    if (label === 'Failing') {
      return 'Pending';
    }
    if (passed === false) {
      return 'Failed';
    }
    return 'Failed';
  }, [label, passed]);

  return (
    <>
      <Flex
        minWidth={largeSize ? '1000px' : '500px'}
        opacity={inActive ? '0.5' : '1'}
        flex={1}
        height={'89px'}
        width={largeSize ? '100%' : '100%'}
        backgroundColor="purple"
        borderRadius={12}
        alignItems={'center'}
        onClick={e => {
          onClickListItem && onClickListItem(e);
          setSelectedDaoProposalTitle(title);
          setSelectedDaoProposalId(proposalId);
          navigateToProposal(proposalId as string);
        }}
        cursor={'pointer'}
      >
        <Flex width={largeSize ? '70%' : '90%'}>
          <Flex
            flexWrap="wrap"
            width={'30%'}
            flexDirection={'column'}
            align="flex-start"
            justifyContent="space-around"
          >
            <Flex alignItems="center" pl="4" pr={2} w="full">
              <Flex flexDir="column" alignItems="center" w="full">
                <Tooltip hasArrow isDisabled={title.length < 20} label={title}>
                  <Text
                    color="white"
                    fontFamily={'DM Sans'}
                    fontWeight="normal"
                    fontSize={18}
                    width={'100%'}
                    wordBreak={'break-all'}
                    noOfLines={1}
                    textOverflow="ellipsis"
                  >
                    {title}
                  </Text>
                </Tooltip>

                <Flex alignItems="flex-start" flexDir="column" w="100%">
                  <Text
                    noOfLines={1}
                    color="white"
                    fontFamily={'DM Sans'}
                    fontWeight="normal"
                    fontSize={14}
                    whiteSpace={'nowrap'}
                    overflow="visible"
                    opacity={'70%'}
                  >
                    {type}
                  </Text>
                  {daoInfo?.dao_name && (
                    <Tooltip hasArrow label={daoInfo?.dao_name}>
                      <Text
                        width="auto"
                        color="white"
                        fontFamily={'DM Sans'}
                        fontWeight="normal"
                        fontSize={14}
                        noOfLines={1}
                        wordBreak={'break-all'}
                        textOverflow="ellipsis"
                      >
                        by {daoInfo?.dao_name}
                      </Text>
                    </Tooltip>
                  )}
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
              targetPercentage={thresholdPercent}
              yesCount={yesCount}
              noCount={noCount}
              noPercent={noPercent}
              yesPercent={yesPercent}
              target={threshold}
            />
          </Flex>
        </Flex>
        {largeSize && (
          <>
            <Flex width="15%" alignItems="center" justifyContent="flex-start">
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
                    <Image
                      src="/JMES_Icon_white.svg"
                      alt="JMES Icon"
                      width={'9px'}
                      mr="1"
                      height={'10.98px'}
                    />
                    <Text
                      color="white"
                      fontWeight="normal"
                      fontSize={14}
                      fontFamily="DM Sans"
                    >
                      {formatBalanceWithComma(
                        Number(fundingPerMonth ?? 0) || 0,
                        1,
                        0,
                      )}
                    </Text>
                  </Flex>
                </Tooltip>
              )}
            </Flex>
            <Box width="15%" justifyContent={'center'}>
              <Flex pr="2" justifyContent="space-between">
                <Text
                  color="white"
                  fontWeight="normal"
                  fontSize={14}
                  fontFamily="DM Sans"
                >
                  {votingDuration}
                </Text>
                {(passed !== undefined || label !== undefined) && (
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
        )}
      </Flex>
    </>
  );
};

export const ProgressBar = ({
  yesPercent,
  threshold,
  thresholdPercent,
  noPercent,
  noCount,
  yesCount,
}: {
  noCount: number;
  yesCount: number;
  noPercent: number;
  thresholdPercent: number;
  yesPercent: number;
  threshold: number;
  isGov: boolean;
}) => {
  return (
    <Box
      height={'60px'}
      borderRadius={'30px'}
      width={'430px'}
      backgroundColor={'rgba(81, 54, 194, 1)'}
      padding={'10px 20px'}
      position={'relative'}
    >
      <Flex
        width={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Text
          color="white"
          fontWeight="normal"
          fontSize={14}
          fontFamily="DM Sans"
          textTransform="uppercase"
          opacity={yesPercent > noPercent ? '0.5' : '1'}
          width={'48px'}
          textAlign={'right'}
        >
          No {noCount}
        </Text>
        <Progress
          value={noPercent}
          backgroundColor={'#5136C2'}
          width={'calc(100% - 56px)'}
          height={'10px'}
          borderRadius={'10px'}
          variant={'red'}
        />
      </Flex>
      <Flex
        width={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Text
          color="white"
          fontWeight="normal"
          fontSize={14}
          fontFamily="DM Sans"
          textTransform="uppercase"
          opacity={yesPercent > noPercent ? '1' : '0.5'}
          width={'48px'}
          textAlign={'right'}
        >
          Yes {yesCount}
        </Text>
        <Progress
          value={yesPercent}
          backgroundColor={'#5136C2'}
          width={'calc(100% - 56px)'}
          height={'10px'}
          borderRadius={'10px'}
          variant={'green'}
        />
      </Flex>
      <Box
        position={'absolute'}
        top={'0'}
        bottom={'0'}
        left={'76px'}
        right={'20px'}
      >
        <Box
          position={'absolute'}
          left={'calc(' + thresholdPercent + '% - 13px)'}
          top={0}
          bottom={0}
          width={'26px'}
        >
          <Box
            position={'absolute'}
            top={'-10px'}
            left="calc(50% - 16px)"
            height={'20px'}
            width="32px"
            backgroundColor={'white'}
            zIndex={2}
            borderRadius={'10px'}
          >
            <Text
              color="rgba(81, 54, 194, 1)"
              fontWeight="500"
              fontSize={'14px'}
              fontFamily="DM Sans"
              letterSpacing={'-0.05em'}
              textAlign={'center'}
            >
              {threshold}
            </Text>
          </Box>
          <Flex
            position="absolute"
            top={0}
            bottom={0}
            left={'10px'}
            width={'6px'}
          >
            <Box
              width={'2px'}
              height={'100%'}
              backgroundColor={'rgba(116, 83, 253, .5)'}
            />
            <Box width={'2px'} height={'100%'} backgroundColor={'white'} />
            <Box
              width={'2px'}
              height={'100%'}
              backgroundColor={'rgba(116, 83, 253, .5)'}
            />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export const roundNumber = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;
