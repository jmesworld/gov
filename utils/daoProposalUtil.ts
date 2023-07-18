import { ProposalResponseForEmpty } from '../client/DaoMultisig.types';

type Args = {
  proposal?: ProposalResponseForEmpty;
  yesVotes: number;
  threshold: number;
};

export const getLabel = ({ proposal, yesVotes, threshold }: Args) => {
  if (!proposal) return null;
  let label: null | string = null;
  let labelSuccess: null | boolean = null;
  let expired = false;

  const expireTime = proposal.expires;
  if ('at_time' in expireTime) {
    expired = Number(expireTime.at_time || 0) / 1e6 < Date.now();
  }

  if (proposal.status === 'executed' || proposal.status === 'passed') {
    label = expired ? 'Executed' : 'Passing';
    labelSuccess = true;
  }

  if (proposal.status === 'rejected' && expired) {
    label = 'Rejected';
    labelSuccess = false;
  }

  if (proposal.status === 'pending' || proposal.status === 'open') {
    label = yesVotes >= threshold ? 'Passing' : 'Failing';
    labelSuccess = yesVotes >= threshold;
  }
  if (label === null || labelSuccess === null) {
    return null;
  }
  return {
    label,
    labelSuccess,
  };
};
