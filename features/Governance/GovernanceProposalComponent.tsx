import { Button, Flex, Skeleton } from '@chakra-ui/react';
import { GovernanceQueryClient } from '../../client/Governance.client';
import GovHeader from './GovHeader';
import { ProposalHeader } from '../components/Proposal/ProposalList';
import { ProposalList } from '../components/Proposal/ProposalList';

import { ProposalResponse } from '../../client/Governance.types';
import Pagination from 'rc-pagination';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

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
      <Flex height={'35px'} />
      <GovHeader />
      <Flex height={'46px'} />
      <ProposalHeader proposalTitle={proposalTitle} isGov={true} />
      <Flex height={'9px'} />
      {!data.length && (isLoading || isFetching) && (
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
          <Pagination
            disabled={isLoading || isFetching}
            style={{
              listStyle: 'none',
              display: 'flex',
              gap: 5,
              justifyContent: 'flex-end',
            }}
            onChange={page => {
              pagination.setPage(page);
            }}
            total={pagination.total}
            itemRender={(current, type, element) => {
              if (type === 'prev' || type === 'next') {
                return (
                  <Button
                    size="sm"
                    listStyleType="none"
                    ml={2}
                    mr={2}
                    display="inline-block"
                  >
                    {type === 'prev' && <ChevronLeftIcon />}
                    {type === 'next' && <ChevronRightIcon />}
                  </Button>
                );
              }

              if (type === 'page') {
                return (
                  <Button
                    size="sm"
                    variant={
                      current === pagination.page ? 'purple' : 'purpleText'
                    }
                    listStyleType="none"
                    display="inline-block"
                  >
                    {current}
                  </Button>
                );
              }
              return element;
            }}
            pageSize={pagination.limit}
          />
        </Flex>
      )}
    </Flex>
  );
}
