import { useRouter } from 'next/router';
import type { NextPageWithLayout } from '../_app';
import GovProposalDetail from '../../features/Governance/GovProposalDetail';
import { CoinSupplyContextProvider } from '../../contexts/CoinSupply';

const ProposalDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.query.id;
  if (!id || Array.isArray(id) || !Number(id)) {
    return <p> not Found </p>;
  }

  return (
    <CoinSupplyContextProvider>
      <GovProposalDetail proposalId={Number(id)} />;
    </CoinSupplyContextProvider>
  );
};

export default ProposalDetail;
