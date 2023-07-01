/* eslint-disable @typescript-eslint/ban-types */
import { Box, Flex, Image, Spinner, Text } from '@chakra-ui/react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import DaoMembersList from '../DaoMemberList';

import { DaoMultisigQueryClient } from '../../../client/DaoMultisig.client';
import { useDaoMultisigListProposalsQuery } from '../../../client/DaoMultisig.react-query';

import {
  ProposalHeader,
  ProposalList,
} from '../../components/Proposal/ProposalList';
import { useCosmWasmClientContext } from '../../../contexts/CosmWasmClient';

import { useAccountBalance } from '../../../hooks/useAccountBalance';

export default function DaoProposal({
  daoAddress,
  daoName,
  setDaoProposalDetailOpen,
  setSelectedDaoProposalTitle,
  setSelectedDaoMembersList,
  setSelectedProposalId,
}: {
  daoAddress: string;
  daoName: string;
  // TODO: update ts types
  setDaoProposalDetailOpen: Function;
  setSelectedDaoProposalTitle: Function;
  setSelectedDaoMembersList: Function;
  setSelectedProposalId: Function;
}) {
  const { cosmWasmClient } = useCosmWasmClientContext();
  const {
    data: balance,
    isLoading,
    isFetching,
  } = useAccountBalance(daoAddress, 1 * 1000);

  const daoQueryClient = new DaoMultisigQueryClient(
    cosmWasmClient as CosmWasmClient,
    daoAddress as string,
  );

  const {
    data,
    isFetching: fetchingBalance,
    isLoading: loadingBalance,
  } = useDaoMultisigListProposalsQuery({
    client: daoQueryClient,
    args: { limit: 10000 },
    options: {
      queryKey: ['daoDetail', daoAddress],
      refetchInterval: 10000,
    },
  });

  return (
    <>
      <Flex height={'47px'} />
      <Text
        color={'darkPurple'}
        fontWeight="bold"
        fontSize={28}
        fontFamily="DM Sans"
      >
        {daoName}
      </Text>
      {(fetchingBalance || loadingBalance) && !balance && (
        <Flex>
          <Text fontSize="sm"> Loading Balance ...</Text>
          <Spinner size="sm" />
        </Flex>
      )}
      {balance && (
        <Flex>
          <Flex
            borderWidth={1}
            borderStyle="solid"
            borderColor="purple"
            px={3}
            alignItems="center"
          >
            <Text mr={3}>JMES</Text>
            <Image
              src="/JMES_Icon.svg"
              alt="JMES Icon"
              width={4}
              mr={1}
              height={4}
            />
            <Text> {balance?.unstaked}</Text>
          </Flex>
          <Flex
            borderWidth={1}
            borderStyle="solid"
            borderColor="purple"
            px={3}
            alignItems="center"
          >
            <Text mr={3}>bJMES</Text>
            <Image
              src="/JMES_bonded_icon.svg"
              alt="JMES Icon"
              width={4}
              mr={1}
              height={4}
            />
            <Text> {balance?.staked}</Text>
          </Flex>
        </Flex>
      )}
      <Flex height={'16px'} />
      <Flex>
        <Box flexGrow={1}>
          <ProposalHeader isGov={false} />
          <Flex height={'10px'} />
          {data && (
            <ProposalList
              proposals={data?.proposals}
              isGov={false}
              daoAddress={daoAddress}
              onClickListItem={() => {
                setDaoProposalDetailOpen(true);
              }}
              setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
              setSelectedProposalId={setSelectedProposalId}
            />
          )}

          {isLoading ||
            (isFetching && !data && (
              <Flex justifyContent="center" width="100%">
                <Text
                  color="rgba(15,0,86,0.8)"
                  fontFamily={'DM Sans'}
                  fontWeight="normal"
                  fontStyle={'italic'}
                  fontSize={14}
                  marginTop={'24px'}
                >
                  Loading DAO proposals...
                </Text>
              </Flex>
            ))}
        </Box>
        <DaoMembersList
          daoQueryClient={daoQueryClient}
          setSelectedDaoMembersList={setSelectedDaoMembersList}
        />
      </Flex>
    </>
  );
}
