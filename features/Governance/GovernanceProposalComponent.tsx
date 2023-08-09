import { Flex, Skeleton, Text } from '@chakra-ui/react';
import { GovernanceQueryClient } from '../../client/Governance.client';
import { ProposalHeader } from '../components/Proposal/ProposalList';
import { ProposalList } from '../components/Proposal/ProposalList';

import { ProposalResponse } from '../../client/Governance.types';
import { SimplePagination } from '../components/genial/Pagination';

type Props = {
  governanceQueryClient: GovernanceQueryClient;
  setSelectedProposalId: (id: number) => void;
  data: ProposalResponse[];
  isLoading: boolean;
  isFetching: boolean;
  setSelectedDaoProposalTitle: (title: string) => void;
  supply: number;
  pagination?: {
    limit: number;
    offset: number;
    page: number;
    setPage: (page: number) => void;
    total: number;
  };
  proposalTitle?: string;
  tab?: string;
};
// TODO: fix passing/passed
export default function GovernanceProposalComponent({
  setSelectedProposalId,
  governanceQueryClient,
  setSelectedDaoProposalTitle,
  supply,
  pagination,
  proposalTitle,
  isLoading,
  isFetching,
  data,
  tab,
}: Props) {
  return (
    <Flex flexDir="column" pb="4">
      <ProposalHeader proposalTitle={proposalTitle} isGov={true} />
      <Flex height={'9px'} />
      {!data.length &&
        pagination &&
        !pagination?.total &&
        (isLoading || isFetching) && (
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
      {((!data.length && pagination?.page) ||
        (!data.length && !pagination)) && (
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
        <Flex flexDir="column" mb="25px">
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

      {pagination && pagination.total > pagination.limit && (
        <Flex justifyContent="flex-end">
          <SimplePagination
            enabled={pagination.page !== 1 || data.length === pagination.limit}
            page={pagination.page}
            nextPage={data.length === pagination.limit}
            prevPage={pagination.page > 1}
            onPage={page => pagination.setPage(page)}
          />
        </Flex>
      )}
    </Flex>
  );
}
