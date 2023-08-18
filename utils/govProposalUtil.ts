import { ProposalResponse } from '../client/Governance.types';
import { convertBlockToMonth } from './block';

export const getGovProposalFunding = (proposal: ProposalResponse) => {
  let votingDuration = null;
  let votingDurationNum = null;
  if (!proposal.funding) {
    return null;
  }
  const durationInBlock = proposal.funding.duration_in_blocks;
  if (durationInBlock === undefined) {
    return null;
  }

  const duration = convertBlockToMonth(proposal?.funding?.duration_in_blocks);
  votingDurationNum = duration.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  votingDuration = `${votingDurationNum} month${duration !== 1 ? 's' : ''}`;
  const fundingAmount = proposal?.funding?.amount;
  if (fundingAmount === undefined) {
    return null;
  }

  const fundingPerMonth =
    Number(fundingAmount) / (Number(votingDurationNum) || 1);

  return {
    votingDuration,
    fundingPerMonth,
  };
};

export const getProposalLabelDetail = (
  proposal: ProposalResponse,
  thresholdPercent: number,
  yesPercentage: number,
): {
  label: string | null;
  color: string | null;
} => {
  const { status } = proposal;
  let label: string | null = null;
  let color: string | null = null;
  if (status === 'success' || status === 'success_concluded') {
    label = 'Passed';
    color = 'green';
  }

  if (status === 'expired' || status === 'expired_concluded') {
    label = 'Failed';
    color = 'red';
  }
  if (status === 'posted' || status === 'voting') {
    label = thresholdPercent <= yesPercentage ? 'Passing' : 'pending';
    color = thresholdPercent <= yesPercentage ? 'green' : 'yellow';
  }
  return {
    label,
    color,
  };
};
