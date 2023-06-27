import { Flex } from '@chakra-ui/react';
import { GovernanceQueryClient } from '../../client/Governance.client';
import { useGovernanceProposalsQuery } from '../../client/Governance.react-query';

import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

import GovHeader from './GovHeader';
import { ProposalHeader } from '../components/Proposal/ProposalList';
import { ProposalList } from '../components/Proposal/ProposalList';
import { useAppState } from '../../contexts/AppStateContext';

const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;
type Props = {
  cosmWasmClient: CosmWasmClient;
  setSelectedProposalId: (id: number) => void;
};
export default function GovernanceProposal({
  setSelectedProposalId,
  cosmWasmClient,
}: Props) {
  const { setSelectedDaoProposalTitle } = useAppState();
  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT,
  );

  const governanceProposalQuery = useGovernanceProposalsQuery({
    client: governanceQueryClient,
    args: {},
    options: {
      refetchInterval: 10000,
    },
  });

  return (
    <>
      <Flex height={'35px'} />
      <GovHeader />
      <Flex height={'46px'} />
      <ProposalHeader isGov={true} />
      <Flex height={'10px'} />

      <ProposalList
        proposals={governanceProposalQuery?.data?.proposals}
        isGov={true}
        setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
        setSelectedProposalId={setSelectedProposalId}
      />
    </>
  );
}
