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
      member =>
        member.error ||
        !(member.name && member.address) ||
        (member.votingPower !== undefined && Number(member.votingPower) <= 0),
    );
    const votingPowerHasChanged = membersArr.some(
      member => member.votingPower !== member.ogWeight || member.isRemoved,
    );
    if (!votingPowerHasChanged) {
      errors.push('Please change voting power of at least one member');
    }

    if (memberHasErrors) {
      errors.push('Please Enter Members correctly');
    }
    const memberVoteAddition = membersArr.reduce((acc, curr) => {
      if (curr.isRemoved) return acc;
      acc += Number(curr.votingPower ?? 0);
      return acc;
    }, 0);
    if (memberVoteAddition !== 100) {
      errors.push('Voting Power added should be 100');
    }

    return errors;
  }

  if (activeTab === 'spend-dao-funds') {
    const spendsArr = Object.values(state.spends);
    const spendHasIssue = spendsArr.some(
      spend => !spend.amount || !spend.name || !spend.address || spend.error,
    );

    const spendsTotal = spendsArr.reduce((acc, curr) => {
      acc += curr.amount || 0;
      return acc;
    }, 0);
    if (!state.balance || !state.balance.jmes) {
      errors.push('No balance found');
    }

    if (
      (state.balance &&
        state.balance.jmes &&
        spendsTotal > Number(state.balance.jmes)) ||
      0
    ) {
      errors.push('No enough balance to send');
    }

    if (spendHasIssue) {
      errors.push('Please correct Address field you want to send to');
    }
    return errors;
  }
  return errors;
};
