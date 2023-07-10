/* eslint-disable @typescript-eslint/ban-types */
import { Box, Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import DaoMembersList from '../DaoMemberList';

import { DaoMultisigQueryClient } from '../../../client/DaoMultisig.client';
import { useDaoMultisigListProposalsQuery } from '../../../client/DaoMultisig.react-query';

import {
  ProposalHeader,
  ProposalList,
} from '../../components/Proposal/ProposalList';
import { useCosmWasmClientContext } from '../../../contexts/CosmWasmClient';

import { BalanceDisplay } from './Balance';
import { useCoinSupplyContext } from '../../../contexts/CoinSupply';
import { useMemo } from 'react';
import { GovernanceQueryClient } from '../../../client/Governance.client';
import { NEXT_PUBLIC_GOVERNANCE_CONTRACT } from '../../../config/defaults';
import { useClipboardTimeout } from '../../../hooks/useClipboard';

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
  const { supply } = useCoinSupplyContext();
  const [copied, copyToClipboard] = useClipboardTimeout();
  const daoQueryClient = useMemo(
    () =>
      new DaoMultisigQueryClient(
        cosmWasmClient as CosmWasmClient,
        daoAddress as string,
      ),
    [cosmWasmClient, daoAddress],
  );
  const goverrnanceQueryClient = useMemo(
    () =>
      new GovernanceQueryClient(
        cosmWasmClient as CosmWasmClient,
        NEXT_PUBLIC_GOVERNANCE_CONTRACT,
      ),
    [cosmWasmClient],
  );

  const { data, isFetching, isLoading } = useDaoMultisigListProposalsQuery({
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
      <Flex flexDir="column">
        <Text
          color={'darkPurple'}
          fontWeight="bold"
          fontSize={28}
          fontFamily="DM Sans"
        >
          {daoName}
        </Text>
        <Flex>
          <Flex mt="2" alignItems="center">
            <Text mr="2" color="purple">
              {daoAddress.slice(0, 20)}...{daoAddress.slice(-6)}
            </Text>
            {copied && (
              <Text display="inline" ml="2" fontSize={14}>
                copied
              </Text>
            )}
            <Tooltip hasArrow label="Copy DAO address" placement="top">
              <Image
                mr="4"
                cursor="pointer"
                display="inline-block"
                src="/copy.svg"
                width="16px"
                height="16px"
                marginLeft="2px"
                alt="Dao Address"
                onClick={() => {
                  copyToClipboard(daoAddress);
                }}
              />
            </Tooltip>
          </Flex>
          <BalanceDisplay address={daoAddress} />
        </Flex>
      </Flex>
      <Flex height={'16px'} />
      <Flex>
        <Box flexGrow={1}>
          <ProposalHeader isGov={false} />
          <Flex height={'10px'} />
          {data && (
            <ProposalList
              client={goverrnanceQueryClient}
              daoName={daoName}
              totalSupply={supply as number}
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
