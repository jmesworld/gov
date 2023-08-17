const initialBlockReward = 19.92;

const reductionRate = 0.1262;

// approximated 1 year
const reductionBlockInterval = 6311520;

export const getCurrentReward = (block: number): number => {
  const reductionCount = Math.floor(block / reductionBlockInterval);
  if (reductionCount === 0) {
    return initialBlockReward;
  }
  return reductionRate * reductionCount * initialBlockReward;
};

type ProposalType = 'core_slot' | string;
type CoreSlotType = 'core_tech' | string;
export const getMaxRewardPerBlock = (
  currentBlock: number,
  proposalType: ProposalType,
  coreSlotType: CoreSlotType,
) => {
  const currentReward = getCurrentReward(currentBlock);
  if (proposalType !== 'core_slot') {
    return 0.25 * currentReward;
  }
  if (coreSlotType === 'core_tech') {
    return 0.25 * currentReward;
  }
  return 0.125 * currentReward;
};
