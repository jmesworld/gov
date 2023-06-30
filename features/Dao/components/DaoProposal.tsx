import { Box, Flex, Text } from '@chakra-ui/react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useChain } from '@cosmos-kit/react';
import { useEffect, useState } from 'react';

import { GovernanceQueryClient } from '../../../client/Governance.client';
import { useGovernancePeriodInfoQuery } from '../../../client/Governance.react-query';
import { IdentityserviceQueryClient } from '../../../client/Identityservice.client';
import { useIdentityserviceGetIdentityByOwnerQuery } from '../../../client/Identityservice.react-query';
import DaoMembersList from '../DaoMemberList';

import { chainName } from '../../../config/defaults';
import { DaoMultisigQueryClient } from '../../../client/DaoMultisig.client';
import { useDaoMultisigListProposalsQuery } from '../../../client/DaoMultisig.react-query';

import {
  ProposalHeader,
  ProposalList,
} from '../../components/Proposal/ProposalList';

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

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
  setDaoProposalDetailOpen: Function;
  setSelectedDaoProposalTitle: Function;
  setSelectedDaoMembersList: Function;
  setSelectedProposalId: Function;
}) {
  const chainContext = useChain(chainName);
  const { address, getCosmWasmClient } = chainContext;

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

  const LCDOptions = {
    URL: LCD_URL,
    chainID: CHAIN_ID,
  };
  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT,
  );

  const args = { owner: address ? address : '' };
  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT,
  );

  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client,
    args,
  });

  const periodInfoQuery = useGovernancePeriodInfoQuery({
    client: governanceQueryClient,
    options: {
      refetchInterval: 10000,
    },
  });

  const daoQueryClient = new DaoMultisigQueryClient(
    cosmWasmClient as CosmWasmClient,
    daoAddress as string,
  );
  const proposalsQuery = useDaoMultisigListProposalsQuery({
    client: daoQueryClient,
    args: { limit: 10000 },
    options: {
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
      <Flex height={'46px'} />
      <Flex>
        <Box flexGrow={1}>
          <ProposalHeader isGov={false} />
          <Flex height={'10px'} />
          {!!proposalsQuery.data ? (
            <ProposalList
              proposals={proposalsQuery?.data?.proposals}
              isGov={false}
              daoAddress={daoAddress}
              onClickListItem={() => {
                setDaoProposalDetailOpen(true);
              }}
              setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
              setSelectedProposalId={setSelectedProposalId}
            />
          ) : (
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
          )}
        </Box>
        <DaoMembersList
          daoAddress={daoAddress}
          setSelectedDaoMembersList={setSelectedDaoMembersList}
        />
      </Flex>
    </>
  );
}
