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
  yesCount,
  noCount,
  totalCount,
  threshold,
  pass,
  type,
  isGov,
  daoAddress,
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
        height={'64px'}
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
        <Box flexGrow={1}>
          <Flex width={'100%'}>
            <Box flexGrow={1}>
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
            </Box>
            <Box flexGrow={1} marginLeft={isGov ? '112px' : '-18px'}>
              <Tooltip
                hasArrow={true}
                label={`${roundNumber(yesPercentActual * 100)}%`}
                bg={'midnight'}
                color={'white'}
                direction={'rtl'}
                placement={'right'}
                borderRadius={'8px'}
              >
                <Text
                  width={'60px'}
                  color="white"
                  fontFamily={'DM Sans'}
                  fontWeight="normal"
                  fontSize={18}
                >
                  {yes}
                </Text>
              </Tooltip>
            </Box>
            <Box flexGrow={1} marginLeft={isGov ? '72px' : '42px'}>
              <Tooltip
                hasArrow={true}
                label={`${roundNumber(yesPercentActual * 100)}%`}
                bg={'midnight'}
                color={'white'}
                direction={'rtl'}
                placement={'right'}
                borderRadius={'8px'}
              >
                <Text
                  width={'60px'}
                  color="white"
                  fontFamily={'DM Sans'}
                  fontWeight="normal"
                  fontSize={18}
                >
                  {no}
                </Text>
              </Tooltip>
            </Box>

            <Box marginRight={isGov ? '60px' : '102px'} />
            <Box flexGrow={1}>
              <Text
                width={'87px'}
                color="white"
                fontFamily={'DM Sans'}
                fontWeight="normal"
                fontSize={18}
                marginLeft={isGov ? '103px' : '12px'}
              >
                {threshold?.toString() + '%'}
              </Text>
            </Box>
          </Flex>

          <Flex alignItems={'center'}>
            <Box flexGrow={1}>
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
            </Box>

            <Box
              width={'9px'}
              height={'9px'}
              backgroundColor="#68FFF1"
              marginLeft={isGov ? '135px' : '0%'}
              borderRadius={90}
            />
            <Box flexGrow={1}>
              <Text
                color="white"
                fontFamily={'DM Sans'}
                fontWeight="normal"
                fontSize={14}
                marginLeft={'6px'}
                opacity={'70%'}
                width={'65px'}
              >
                {yesCount < 99 ? `${yesCount} votes` : `99+ votes`}
              </Text>
            </Box>

            <Box
              alignSelf={'center'}
              width={'9px'}
              height={'9px'}
              backgroundColor="#FF5876"
              marginLeft={isGov ? '73px' : '42px'}
              borderRadius={90}
            />
            <Box flexGrow={1}>
              <Text
                color="white"
                fontFamily={'DM Sans'}
                fontWeight="normal"
                fontSize={14}
                marginLeft={'6px'}
                opacity={'70%'}
                width={'65px'}
                marginRight={isGov ? '82px' : '36px'}
              >
                {noCount < 99 ? `${noCount} votes` : `99+ votes`}
              </Text>
            </Box>
            <Box flexGrow={1}>
              <ProgressBar
                yesPercent={yesPercent}
                threshold={threshold}
                isGov={isGov}
              />
            </Box>
          </Flex>
        </Box>
        <Flex
          width={'64px'}
          height={'24px'}
          marginLeft={isGov ? '90px' : '49px'}
          marginRight={isGov ? '98px' : '49px'}
          borderRadius={'90px'}
          borderWidth={'1px'}
          borderColor={pass === 'Yes' ? 'green' : 'red'}
          backgroundColor={'transparent'}
          justifyContent={'center'}
        >
          <Text
            color="white"
            fontWeight="normal"
            fontSize={14}
            fontFamily="DM Sans"
          >
            {pass}
          </Text>
        </Flex>
      </Flex>
      <Box flexGrow={1} height={'7px'} />
    </>
  );
};

export const ProgressBar = ({
  yesPercent,
  threshold,
  isGov,
}: {
  yesPercent: number;
  threshold: number;
  isGov: boolean;
}) => {
  return (
    <Progress
      value={yesPercent}
      backgroundColor={'#5136C2'}
      width={isGov ? '191px' : '180px'}
      height={'6px'}
      borderRadius={'10px'}
      variant={yesPercent <= threshold ? 'red' : 'green'}
    >
      <ProgressLabel marginLeft={threshold?.toString() + '%'} height={'8px'}>
        <Flex
          backgroundColor={'transparent'}
          width={'3px'}
          height={'8px'}
          alignItems={'center'}
        >
          <Box width={'1px'} height={'6px'} backgroundColor="#7453FD" />
          <Box width={'1px'} height={'8px'} backgroundColor="white" />
          <Box width={'1px'} height={'6px'} backgroundColor="#7453FD" />
        </Flex>
      </ProgressLabel>
    </Progress>
  );
};

export const roundNumber = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;
