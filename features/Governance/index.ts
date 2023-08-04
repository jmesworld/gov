import dynamic from 'next/dynamic';

const GovernanceProposal = dynamic(() => import('./GovernanceProposal'));
const WinningGrantProposals = dynamic(() => import('./WinningGrantsProposal'));
const CoreSlotProposals = dynamic(() => import('./CoreSlotProposals'));
const CreateGovProposal = dynamic(() => import('./CreateGovProposal'));
const GovProposalDetail = dynamic(() => import('./GovProposalDetail'));

const GovProposalVotes = dynamic(() => import('./GovProposalVotes'));
const GovProposalMyVote = dynamic(() => import('./GovProposalMyVote'));
const GovHeader = dynamic(() => import('./GovHeader'));

const Governance = {
  GovernanceProposal,
  GovHeader,
  CreateGovProposal,
  GovProposalVotes,
  GovProposalDetail,
  GovProposalMyVote,
  WinningGrantProposals,
  CoreSlotProposals,
};

export { Governance };
