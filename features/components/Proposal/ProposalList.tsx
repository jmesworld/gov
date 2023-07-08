/* eslint-disable @typescript-eslint/ban-types */
import { Badge, Box, Flex, Progress, Text } from '@chakra-ui/react';
import { MouseEventHandler } from 'react';
import { ProposalProgress } from './ProposalProgress';
import { useRouter } from 'next/router';
import { calculateVotes } from '../../../lib/calculateVotes';
import { useCoinSupplyContext } from '../../../contexts/CoinSupply';
import moment from 'moment';
import { isProposalGov } from '../../../utils/proposalUti';
import { GovernanceQueryClient } from '../../../client/Governance.client';

type BaseProps = {
  totalSupply: number;
  proposals: any;
  onClickListItem?: MouseEventHandler<HTMLDivElement>;
  setSelectedDaoProposalTitle: Function;
  setSelectedProposalId: Function;
  client: GovernanceQueryClient;
  isGovList?: boolean;
  largeSize?: boolean;
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
  largeSize,
  onClickListItem,
  setSelectedDaoProposalTitle,
  setSelectedProposalId,
  totalSupply,
  client,
  isGovList,
  ...rest
}: Props) => {
  const router = useRouter();
  const { supply } = useCoinSupplyContext();

  const navigateToProposal = (proposalId: string, isGov: boolean) => {
    if (isGov) {
      router.push(`/proposals/${proposalId}`);
      return;
    }
    router.push(`/dao/view/${daoName}/proposals/${proposalId}`);
  };

  if (!proposals || Array.from(proposals).length === 0) {
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
      let votingDuration = null;
      const isGov = isProposalGov(proposal, client);
      if (proposal?.voting_start && proposal?.voting_end) {
        const start = new Date(proposal?.voting_start);
        const end = new Date(proposal?.voting_end);

        const diff = moment(end).diff(moment(start));
        votingDuration = moment.duration(diff).humanize();
      }

      const propType = JSON.stringify(proposal?.prop_type)
        ?.split(':')?.[0]
        ?.slice(2);

      const type = propType
        ? propType.slice(0, propType.length - 1)
        : proposal.description;

      if (isGovList) {
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
          totalSupply: supply as number,
        });

        return (
          <ProposalListItem
            votingDuration={votingDuration ?? undefined}
            key={proposal.id + proposal.description}
            title={proposal.title}
            yesCount={coinYes}
            isGov={isGov}
            thresholdPercent={thresholdPercent}
            noCount={coinNo}
            yesPercent={yesPercentage}
            noPercent={noPercentage}
            totalCount={totalSupply}
            threshold={threshold}
            type={type}
            navigateToProposal={id => navigateToProposal(id, isGovList)}
            pass={
              proposal.status === 'passed' ||
              proposal.status === 'success' ||
              proposal.status === 'executed' ||
              proposal.status === 'success_concluded'
                ? 'Yes'
                : 'No'
            }
            largeSize={isGovList ? true : false}
            daoAddress={isGov ? undefined : rest.daoAddress}
            proposalId={proposal.id}
            onClickListItem={onClickListItem}
            setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
            setSelectedDaoProposalId={setSelectedProposalId}
          />
        );
      }
      const threshold = proposal.threshold?.absolute_count;
      const target = threshold ? threshold.weight : 0;
      const yesPercentage = threshold ? threshold.total_weight : 0;
      const noPercentage = 100 - yesPercentage;

      return (
        <ProposalListItem
          key={proposal.id + proposal.description}
          title={proposal.title}
          yesCount={yesPercentage}
          thresholdPercent={target}
          noCount={noPercentage}
          yesPercent={yesPercentage}
          noPercent={noPercentage}
          totalCount={totalSupply}
          threshold={target}
          isGov={isGov}
          type={type}
          navigateToProposal={id => navigateToProposal(id, !!isGovList)}
          pass={
            proposal.status === 'passed' ||
            proposal.status === 'success' ||
            proposal.status === 'executed' ||
            proposal.status === 'success_concluded'
              ? 'Yes'
              : 'No'
          }
          largeSize={!!largeSize}
          daoAddress={isGov ? undefined : rest.daoAddress}
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

export const ProposalHeader = ({ isGov }: { isGov: boolean }) => {
  return (
    <Flex flex={1} width={isGov ? '100%' : '100%'}>
      <Flex>
        <Box width={isGov ? '227px' : '151px'}>
          <Text
            color="rgba(15,0,86,0.8)"
            fontWeight="medium"
            fontFamily="DM Sans"
            fontSize={12}
          >
            {isGov ? ' PROPOSALS' : 'DAO PROPOSALS'}
          </Text>
        </Box>
        <Box width={isGov ? '500px' : '440px'}></Box>
      </Flex>
      <Box>
        <Text
          color="rgba(15,0,86,0.8)"
          fontFamily={'DM Sans'}
          fontWeight="medium"
          fontSize={12}
          width={'155px'}
        >
          FUNDING PER MONTH
        </Text>
      </Box>
      <Flex width={'155px'}>
        <Text
          color="rgba(15,0,86,0.8)"
          fontFamily={'DM Sans'}
          fontWeight="medium"
          fontSize={12}
          textAlign={'left'}
          width={'124px'}
        >
          FUNDING DURATION
        </Text>
      </Flex>
    </Flex>
  );
};

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
  isGov,
}: {
  title: string;
  threshold: number;
  pass: string;
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
}) => {
  return (
    <>
      <Flex
        flex={1}
        height={'112px'}
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
        <Flex>
          <Flex
            width={largeSize ? '227px' : '151px'}
            flexDirection={'column'}
            justifyContent={'center'}
          >
            <Text
              width={largeSize ? '281px' : '268px'}
              color="white"
              fontFamily={'DM Sans'}
              fontWeight="normal"
              fontSize={18}
              marginLeft={'14px'}
            >
              {title.length > 20 ? title.substring(0, 20) + '...' : title}
            </Text>
            <Text
              width={largeSize ? '281px' : '268px'}
              color="white"
              fontFamily={'DM Sans'}
              fontWeight="normal"
              fontSize={14}
              marginLeft={'14px'}
              opacity={'70%'}
            >
              {type.length > 26 ? title.substring(0, 26) + '...' : type}
            </Text>
            {isGov && (
              <Badge w="100px" ml="3" fontSize="10px" color="purple" bg="white">
                Gov Proposal
              </Badge>
            )}
          </Flex>
          <Flex
            // flexGrow={1}
            width={largeSize ? '500px' : '440px'}
            alignItems={'center'}
            justifyContent={'space-around'}
          >
            <ProposalProgress
              width={430}
              targetPercentage={thresholdPercent}
              yesCount={yesCount}
              noCount={noCount}
              noPercent={noPercent}
              yesPercent={yesPercent}
              target={threshold}
            />
          </Flex>
        </Flex>
        <Box
          width="155px"
          // marginLeft={isGov ? '90px' : '90px'}
          justifyContent={'center'}
        >
          <Text
            color="white"
            fontWeight="normal"
            fontSize={14}
            fontFamily="DM Sans"
          >
            1000.00
          </Text>
        </Box>
        <Box
          // marginLeft={isGov ? '60px' : '49px'}
          // marginRight={'90px'}
          width="155px"
          justifyContent={'center'}
        >
          <Text
            color="white"
            fontWeight="normal"
            fontSize={14}
            fontFamily="DM Sans"
          >
            {votingDuration}
          </Text>
        </Box>
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
