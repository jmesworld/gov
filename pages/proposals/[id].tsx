import { useRouter } from 'next/router';
import type { NextPageWithLayout } from '../_app';
import GovProposalDetail from '../../features/Governance/GovProposalDetail';

const ProposalDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.query.id;
  if (!id || Array.isArray(id) || !Number(id)) {
    return <p> not Found </p>;
  }

  return <GovProposalDetail proposalId={Number(id)} />;
};

export default ProposalDetail;
