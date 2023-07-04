/* eslint-disable @typescript-eslint/ban-types */
import { Box, Flex, Progress, Text } from '@chakra-ui/react';
import { MouseEventHandler } from 'react';
import { calculateVotes } from '../../../lib/calculateVotes';
import { ProposalProgress } from './ProposalProgress';

export const ProposalList = ({
  proposals,
  isGov,
  daoAddress,
  onClickListItem,
  setSelectedDaoProposalTitle,
  setSelectedProposalId,
  totalSupply,
}: {
  totalSupply: number;
  proposals: any;
  isGov: boolean;
  daoAddress?: string;
  onClickListItem?: MouseEventHandler<HTMLDivElement>;
  setSelectedDaoProposalTitle: Function;
  setSelectedProposalId: Function;
}) => {
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
          {`There are currently no ${
            isGov ? 'Governance' : 'Dao'
          } Proposals available to view`}
        </Text>
      </Flex>
    );
  } else {
    const proposalItems = proposals.map((proposal: any) => {
      const {
        coinYes,
        coinNo,
        threshold,
        noPercentage,
        yesPercentage,
        thresholdPercent,
      } = calculateVotes({
        coin_no: proposal.coins_no,
        coin_Yes: proposal.coins_yes,
        totalSupply,
      });

      const propType = isGov
        ? JSON.stringify(proposal.prop_type).split(':')[0].slice(2)
        : '';
      const type = isGov
        ? propType.slice(0, propType.length - 1)
        : proposal.description;
      return (
        <ProposalListItem
          key={proposal.id + proposal.description}
          title={proposal.title}
          yesCount={coinYes}
          thresholdPercent={thresholdPercent}
          noCount={coinNo}
          yesPercent={yesPercentage}
          noPercent={noPercentage}
          totalCount={totalSupply}
          threshold={threshold}
          type={type}
          pass={
            proposal.status === 'passed' ||
            proposal.status === 'success' ||
            proposal.status === 'executed' ||
            proposal.status === 'success_concluded'
              ? 'Yes'
              : 'No'
          }
          isGov={isGov}
          daoAddress={daoAddress}
          proposalId={proposal.id}
          onClickListItem={onClickListItem}
          setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
          setSelectedDaoProposalId={setSelectedProposalId}
        />
      );
    });

    return <ul>{proposalItems}</ul>;
  }
};

export const ProposalHeader = ({ isGov }: { isGov: boolean }) => {
  return (
    <Flex flex={1} width={isGov ? '100%' : '100%'}>
      <Flex flexGrow={1} width={'100%'}>
        <Box flexGrow={1}>
          <Text
            color="rgba(15,0,86,0.8)"
            fontWeight="medium"
            fontFamily="DM Sans"
            fontSize={12}
            width={isGov ? '227px' : '151px'}
          >
            {isGov ? 'GOVERNANCE PROPOSALS' : 'DAO PROPOSALS'}
          </Text>
        </Box>
        <Box flexGrow={1}>
          <Text
            color="rgba(15,0,86,0.8)"
            fontFamily={'DM Sans'}
            fontWeight="medium"
            fontSize={12}
            marginLeft={isGov ? '200px' : '170px'}
            width={'32px'}
          >
            YES
          </Text>
        </Box>
        <Box flexGrow={1}>
          <Text
            color="rgba(15,0,86,0.8)"
            fontFamily={'DM Sans'}
            fontWeight="medium"
            fontSize={12}
            marginLeft={isGov ? '130px' : '125px'}
            marginRight={isGov ? '100px' : '100px'}
            width={'32px'}
          >
            NO
          </Text>
        </Box>
        <Box flexGrow={1}>
          <Text
            color="rgba(15,0,86,0.8)"
            fontFamily={'DM Sans'}
            fontWeight="medium"
            fontSize={12}
            marginLeft={isGov ? '100px' : '90px'}
            marginRight={isGov ? '30px' : '60px'}
            width={'94px'}
          >
            % TO PASS
          </Text>
        </Box>
      </Flex>
      <Flex
        flexGrow={1}
        marginLeft={isGov ? '76px' : '35px'}
        marginRight={isGov ? '84px' : '35px'}
      >
        <Text
          color="rgba(15,0,86,0.8)"
          fontFamily={'DM Sans'}
          fontWeight="medium"
          fontSize={12}
          textAlign={'center'}
          width={'94px'}
        >
          PASSING
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
  isGov,
  proposalId,
  onClickListItem,
  setSelectedDaoProposalTitle,
  setSelectedDaoProposalId,
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
  isGov: boolean;
  daoAddress?: string;
  proposalId?: string;
  onClickListItem?: MouseEventHandler<HTMLDivElement>;
  setSelectedDaoProposalTitle: Function;
  setSelectedDaoProposalId: Function;
}) => {
  return (
    <>
      <Flex
        flex={1}
        height={'112px'}
        width={isGov ? '100%' : '100%'}
        backgroundColor="purple"
        borderRadius={12}
        alignItems={'center'}
        onClick={e => {
          onClickListItem && onClickListItem(e);
          setSelectedDaoProposalTitle(title);
          setSelectedDaoProposalId(proposalId);
        }}
        cursor={'pointer'}
      >
        <Flex flexGrow={1}>
          <Flex flexDirection={'column'} justifyContent={'center'}>
            <Text
              width={isGov ? '281px' : '268px'}
              color="white"
              fontFamily={'DM Sans'}
              fontWeight="normal"
              fontSize={18}
              marginLeft={'14px'}
            >
              {title.length > 20 ? title.substring(0, 20) + '...' : title}
            </Text>
            <Text
              width={isGov ? '281px' : '268px'}
              color="white"
              fontFamily={'DM Sans'}
              fontWeight="normal"
              fontSize={14}
              marginLeft={'14px'}
              opacity={'70%'}
            >
              {type.length > 26 ? title.substring(0, 26) + '...' : type}
            </Text>
          </Flex>
          <Flex
            flexGrow={1}
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
        <Box marginLeft={isGov ? '90px' : '49px'} justifyContent={'center'}>
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
          marginLeft={isGov ? '90px' : '49px'}
          marginRight={'90px'}
          justifyContent={'center'}
        >
          <Text
            color="white"
            fontWeight="normal"
            fontSize={14}
            fontFamily="DM Sans"
          >
            2 Months
          </Text>
        </Box>
      </Flex>
      <Box flexGrow={1} height={'7px'} />
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
