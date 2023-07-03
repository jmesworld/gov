import { State } from '../../DaoProposalReducer';
import { ProposalTypes } from '../../DAOProposal';

export const validateForm = (
  state: State,
  activeTab: ProposalTypes,
): string[] => {
  const errors: string[] = [];
  // Validate title and description
  if (state.title.error || state.title.value.length === 0) {
    errors.push(state.title.error || 'Title needed');
  }
  if (state.description.error || state.description.value.length === 0) {
    errors.push(state.description.error || 'Description needed');
  }

  if (activeTab === 'text') {
    return errors;
  }
  if (activeTab === 'update-directories') {
    const membersArr = Object.values(state.members);
    const memberHasErrors = membersArr.some(
      member => member.error || !(member.name && member.address),
    );
    if (memberHasErrors) {
      errors.push('Please Enter Members correctly');
    }
    const memberVoteAddition = membersArr.reduce((acc, curr) => {
      acc += curr.votingPower ?? 0;
      return acc;
    }, 0);
    if (memberVoteAddition !== 100) {
      errors.push('Voting Power added should be 100');
    }

    if (state.threshold.error || state.threshold.value == '0') {
      errors.push('Threshold should be correct');
    }
    return errors;
  }

  if (activeTab === 'spend-dao-funds') {
    const spendsArr = Object.values(state.spends);
    const spendHasIssue = spendsArr.some(
      spend => !spend.amount || !spend.name || !spend.address || spend.error,
    );
    if (spendHasIssue) {
      errors.push('Please correct Address field you want to send to');
    }
    return errors;
  }
  return errors;
};
