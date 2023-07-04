import {
  Box,
  Flex,
  Progress,
  ProgressLabel,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { MouseEventHandler, useEffect, useState } from 'react';

import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useChain } from '@cosmos-kit/react';
import { DaoMultisigQueryClient } from '../../../client/DaoMultisig.client';
import {
  useDaoMultisigListVotersQuery,
  useDaoMultisigListVotesQuery,
} from '../../../client/DaoMultisig.react-query';
import { chainName } from '../../../config/defaults';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export const ProposalList = ({
  proposals,
  isGov,
  daoAddress,
  onClickListItem,
  setSelectedDaoProposalTitle,
  setSelectedProposalId,
}: {
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
      const yesVoters = proposal?.yes_voters?.length;
      const noVoters = proposal?.no_voters?.length;
      const totalVoters = isGov ? yesVoters + noVoters : 0;

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
          yesCount={yesVoters}
          noCount={noVoters}
          totalCount={totalVoters}
          threshold={proposal.threshold?.absolute_percentage?.percentage}
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

  type,
  isGov,
  proposalId,
  onClickListItem,
  setSelectedDaoProposalTitle,
  setSelectedDaoProposalId,
}: {
  title: string;
  threshold: number | undefined;
  pass: string;
  type: string;
  yesCount: number;
  noCount: number;
  totalCount: number;
  isGov: boolean;
  daoAddress?: string;
  proposalId?: string;
  onClickListItem?: MouseEventHandler<HTMLDivElement>;
  setSelectedDaoProposalTitle: Function;
  setSelectedDaoProposalId: Function;
}) => {
  const chainContext = useChain(chainName);
  const { address, getCosmWasmClient, getSigningCosmWasmClient } = chainContext;

  const LCDOptions = {
    URL: RPC_URL,
    chainID: CHAIN_ID,
  };

  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null,
  );
  useEffect(() => {
    if (address) {
      getCosmWasmClient()
        .then(cosmWasmClient => {
          if (!cosmWasmClient) {
            return;
          }
          setCosmWasmClient(cosmWasmClient);
        })
        .catch(error => console.log(error));
    }
  }, [address, getCosmWasmClient]);

  const daoQueryClient = new DaoMultisigQueryClient(
    cosmWasmClient as CosmWasmClient,
    daoAddress as string,
  );

  const votesQuery = useDaoMultisigListVotesQuery({
    client: daoQueryClient,
    args: { proposalId: proposalId ? parseInt(proposalId as string) : 0 },
    options: { refetchInterval: 10000 },
  });

  const votersQuery = useDaoMultisigListVotersQuery({
    client: daoQueryClient,
    args: {},
    options: { refetchInterval: 10000 },
  });

  yesCount = isGov
    ? yesCount
    : !!votesQuery.data
    ? (votesQuery.data?.votes.filter(
        vote =>
          vote.proposal_id === parseInt(proposalId as string) &&
          vote.vote === 'yes',
      )?.length as number)
    : 0;

  noCount = isGov
    ? noCount
    : !!votesQuery.data
    ? (votesQuery.data?.votes.filter(
        vote =>
          vote.proposal_id === parseInt(proposalId as string) &&
          vote.vote === 'no',
      )?.length as number)
    : 0;

  totalCount = isGov
    ? totalCount
    : !!votersQuery.data
    ? votersQuery.data?.voters?.length
    : 0;

  const yesPercentActual = yesCount !== 0 ? yesCount / totalCount : 0;
  const noPercentActual = noCount !== 0 ? noCount / totalCount : 0;

  const yesPercent = totalCount === 0 ? 0 : Math.floor(yesPercentActual * 100);

  const yes = totalCount === 0 ? '0%' : yesPercent.toString() + '%';

  const no = totalCount === 0 ? '0%' : (100 - yesPercent).toString() + '%';

  threshold = isGov || !threshold ? 50 : threshold * 100;

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
            <ProgressBar
              noPercent={40}
              yesPercent={60}
              threshold={50}
              isGov={isGov}
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
  noPercent,
}: {
  noPercent: number;
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
          No {noPercent}
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
          Yes {yesPercent}
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
          left={'calc(' + threshold + '% - 13px)'}
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
