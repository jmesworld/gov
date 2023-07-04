/* eslint-disable @typescript-eslint/ban-types */
import { Box, Flex, Text } from '@chakra-ui/react';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import DaoMembersList from '../DaoMemberList';

import { DaoMultisigQueryClient } from '../../../client/DaoMultisig.client';
import { useDaoMultisigListProposalsQuery } from '../../../client/DaoMultisig.react-query';

import {
  ProposalHeader,
  ProposalList,
} from '../../components/Proposal/ProposalList';
import { useCosmWasmClientContext } from '../../../contexts/CosmWasmClient';

import { ProposalHeader, ProposalList } from "../../components/Proposal/ProposalList";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
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
  // TODO: update ts types
  setDaoProposalDetailOpen: Function;
  setSelectedDaoProposalTitle: Function;
  setSelectedDaoMembersList: Function;
  setSelectedProposalId: Function;
}) {
  const chainContext = useChain(chainName);
  const { address, getCosmWasmClient } = chainContext;

  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  useEffect(() => {
    if (address) {
      getCosmWasmClient()
        .then((cosmWasmClient) => {
          if (!cosmWasmClient) {
            return;
          }
          setCosmWasmClient(cosmWasmClient);
        })
        .catch((error) => console.log(error));
    }
  }, [address, getCosmWasmClient]);

  const LCDOptions = {
    URL: RPC_URL,
    chainID: CHAIN_ID,
  };
  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT
  );

  const args = { owner: address ? address : "" };
  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
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
      <Text
        color={'darkPurple'}
        fontWeight="bold"
        fontSize={28}
        fontFamily="DM Sans"
      >
        {daoName}
      </Text>
      <BalanceDisplay address={daoAddress} />
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
