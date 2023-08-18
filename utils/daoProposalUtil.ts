import { ProposalResponseForEmpty } from '../client/DaoMultisig.types';
import { convertBlockToMonth } from './block';
import { getProposalExcuteMsg } from './proposalUti';

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
    label = 'Passed';
    labelSuccess = true;
  }
  if (proposal.status === 'rejected') {
    label = 'Failed';
    labelSuccess = false;
  }

  if (proposal.status === 'pending' || proposal.status === 'open') {
    label = yesVotes >= threshold ? 'Passed' : 'Pending';
    labelSuccess = yesVotes >= threshold ? true : null;
  }
  if (label === null) {
    return null;
  }
  return {
    label,
    labelSuccess,
    expired,
  };
};

export const getDaoProposalFunding = (proposal: ProposalResponseForEmpty) => {
  const { excuteMsg } = getProposalExcuteMsg(proposal);
  if (!excuteMsg || !('propose' in excuteMsg)) {
    return null;
  }
  if (excuteMsg && 'text_proposal' in excuteMsg.propose) {
    return excuteMsg.propose.text_proposal.funding;
  }
  if (excuteMsg && 'core_slot' in excuteMsg.propose) {
    return excuteMsg.propose.core_slot.funding;
  }

  if (excuteMsg && 'request_feature' in excuteMsg.propose) {
    return excuteMsg.propose.request_feature.funding;
  }
  return null;
};

export const getDaoProposalFundingDetail = (
  proposal: ProposalResponseForEmpty,
) => {
  const fund = getDaoProposalFunding(proposal);
  let votingDuration: null | string = null;
  let votingDurationNum = null;
  let fundingPerMonth = null;
  if (fund?.duration_in_blocks !== undefined) {
    const durationInBlock = Number(fund?.duration_in_blocks);
    const duration = convertBlockToMonth(durationInBlock);
    votingDurationNum = duration.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
    votingDuration = `${votingDurationNum} month${duration !== 1 ? 's' : ''}`;
  }

  if (fund?.amount !== undefined && votingDurationNum !== null) {
    fundingPerMonth =
      Number(fund?.amount || 0) / (Number(votingDurationNum) || 1);
  }
  return {
    votingDuration,
    fundingPerMonth,
  };
};

export const getDaoProposalTarget = (proposal: ProposalResponseForEmpty) => {
  let target = 0;

  const thresholdObj = proposal.threshold;
  if ('absolute_count' in thresholdObj) {
    target = thresholdObj.absolute_count?.weight;
  }

  return target;
};

export const getVotingProgress = (
  status: ProposalResponseForEmpty['status'],
  yesPercent: number,
  noPercent: number,
  target: number,
): {
  label: 'Passed' | 'Failed' | 'Pending' | null;
  color: 'green' | 'red' | 'yellow' | null;
} => {
  let label: 'Passed' | 'Failed' | 'Pending' | null = null;
  let color: 'green' | 'red' | 'yellow' | null = null;

  if (status === 'executed' || status === 'passed') {
    label = 'Passed';
    color = 'green';
  }
  if (status === 'rejected') {
    label = 'Failed';
    color = 'red';
  }
  if (status === 'pending' || status === 'open') {
    label = 'Pending';
    color = 'yellow';
    if (yesPercent >= target) {
      label = 'Passed';
      color = 'green';
    }

    if (noPercent >= target) {
      label = 'Failed';
      color = 'red';
    }
  }

  return {
    label,
    color,
  };
};
