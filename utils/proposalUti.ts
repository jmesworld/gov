import { ProposalResponseForEmpty } from '../client/DaoMultisig.types';
import { GovernanceQueryClient } from '../client/Governance.client';
import { ProposalMsg } from '../client/Governance.types';
import { fromBase64ToString } from './identity';

export const getProposalExcuteMsg = (
  proposal: ProposalResponseForEmpty,
): {
  excuteMsg: { propose: ProposalMsg } | null;
  contractAddr: string | null;
} => {
  let excuteMsg: null | { propose: ProposalMsg } = null;
  let contractAddr: null | string = null;
  proposal?.msgs?.forEach(msg => {
    if (!msg) {
      return;
    }
    if (!('wasm' in msg)) {
      return;
    }
    const wasm = msg.wasm;
    if (!('execute' in wasm)) {
      return;
    }
    const wasmMessage = wasm?.execute?.msg;
    if (!wasmMessage) {
      return;
    }
    const stringMessage = fromBase64ToString<{ propose: ProposalMsg }>(
      wasmMessage,
    );
    if (!stringMessage) {
      return;
    }
    excuteMsg = stringMessage;
    contractAddr = wasm.execute.contract_addr;
  });

  return {
    excuteMsg,
    contractAddr,
  };
};

export const isProposalGov = (
  proposal: ProposalResponseForEmpty,
  client: GovernanceQueryClient,
) => {
  const { contractAddr } = getProposalExcuteMsg(proposal);
  if (!contractAddr) {
    return false;
  }

  return client.contractAddress.includes(contractAddr);
};

export type ProposalMessageType = {
  propose: ProposalMsg;
};

export const getGovProposalType = (
  proposal: ProposalResponseForEmpty,
): {
  proposalType: string | null;
  excuteMsg: ProposalMessageType | null;
} => {
  let proposalType: null | string = null;
  const { excuteMsg } = getProposalExcuteMsg(proposal);
  if (!excuteMsg || !('propose' in excuteMsg)) {
    return {
      proposalType,
      excuteMsg,
    };
  }
  if (excuteMsg && 'text_proposal' in excuteMsg.propose) {
    proposalType = 'text';
  }
  if (excuteMsg && 'core_slot' in excuteMsg.propose) {
    proposalType = 'core-slot';
  }
  if (excuteMsg && 'revoke_proposal' in excuteMsg.propose) {
    proposalType = 'revoke-proposal';
  }

  if (excuteMsg && 'improvement' in excuteMsg.propose) {
    proposalType = 'improvement';
  }

  if (excuteMsg && 'request_feature' in excuteMsg.propose) {
    proposalType = 'feature-request';
  }

  return {
    proposalType,
    excuteMsg,
  };
};

export const calculateFundingPerMonth = (blocks: number) => {
  return ((blocks / 5) * 2629746).toFixed(0);
};
