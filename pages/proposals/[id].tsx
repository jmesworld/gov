import { useRouter } from 'next/router';
import type { NextPageWithLayout } from '../_app';
import GovProposalDetail from '../../features/Governance/GovProposalDetail';
import { CoinSupplyContextProvider } from '../../contexts/CoinSupply';
import { ClosePageButton } from '../../features/components/genial/ClosePageButton';
import { Box, Flex } from '@chakra-ui/react';

const ProposalDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.query.id;
  if (!id || Array.isArray(id) || !Number(id)) {
    return <p> not Found </p>;
  }

  return (
    <CoinSupplyContextProvider>
      <Flex h="100%" justifyContent="space-between" gap="4" flexDir="column">
        <Box>
          <GovProposalDetail proposalId={Number(id)} />
        </Box>
        <ClosePageButton
          onClose={() => {
            router.push('/');
          }}
        />
      </Flex>
    </CoinSupplyContextProvider>
  );
};

export default ProposalDetail;
