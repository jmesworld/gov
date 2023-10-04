import { Flex, Skeleton, Text } from '@chakra-ui/react';
import { GovernanceQueryClient } from '../../client/Governance.client';
import { ProposalHeader } from '../components/Proposal/ProposalList';
import { ProposalList } from '../components/Proposal/ProposalList';

import { ProposalResponse } from '../../client/Governance.types';

type Props = {
  governanceQueryClient: GovernanceQueryClient;
  setSelectedProposalId: (id: number) => void;
  data: ProposalResponse[];
  fetched: boolean;
  setSelectedDaoProposalTitle: (title: string) => void;
  supply: number;

  proposalTitle?: string;
  tab?: string;
  isLoading?: boolean;
};
// TODO: fix passing/passed
export default function GovernanceProposalComponent({
  setSelectedProposalId,
  governanceQueryClient,
  setSelectedDaoProposalTitle,
  supply,
  proposalTitle,
  data,
  tab,
  isLoading,
}: Props) {
  return (
    <Flex flexDir="column" pb="4">
      <ProposalHeader proposalTitle={proposalTitle} isGov={true} />
      <Flex height={'9px'} />
      {isLoading && data.length === 0 && (
        <Flex flexDir="column" justifyContent="center" alignItems="center">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              startColor="skeleton.200"
              endColor="lilac"
              rounded="lg"
              key={i}
              height="89px"
              width="100%"
              mb="10px"
            />
          ))}
        </Flex>
      )}
      {!isLoading && !data.length && (
        <Flex
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
          py="10"
        >
          <Text color="lilac">No proposals found</Text>
        </Flex>
      )}

      {data.length > 0 && (
        <Flex flexDir="column" mb="4">
          <ProposalList
            tab={tab}
            showPassedOrFailed
            showPassingOrFailing
            isGovList
            client={governanceQueryClient}
            totalSupply={supply as number}
            proposals={data}
            isGov={true}
            setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
            setSelectedProposalId={setSelectedProposalId}
          />
        </Flex>
      )}
    </Flex>
  );
}
