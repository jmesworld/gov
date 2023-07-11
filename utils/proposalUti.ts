import { ProposalResponseForEmpty } from '../client/DaoMultisig.types';
import { GovernanceQueryClient } from '../client/Governance.client';
import { ProposalMsg, ProposalResponse } from '../client/Governance.types';
import { fromBase64ToString } from './identity';

export const isProposalGov = (
  proposal: ProposalResponseForEmpty,
  client: GovernanceQueryClient,
) => {
  let contractAddr: null | string = null;

  proposal.msgs?.forEach(msg => {
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
    const wasmMessage = wasm.execute.msg;
    const stringMessage = fromBase64ToString(wasmMessage);
    if (!stringMessage) {
      return;
    }
    if (!wasmMessage) {
      return;
    }

    contractAddr = wasm.execute.contract_addr;
  });
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
  let excuteMsg: null | ProposalMessageType = null;
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
    const stringMessage = fromBase64ToString(
      wasmMessage,
    ) as ProposalMessageType;
    excuteMsg = stringMessage;
    if (!stringMessage) {
      return;
    }
    if ('text_proposal' in stringMessage.propose) {
      proposalType = 'text';
      return;
    }
    if ('core_slot' in stringMessage.propose) {
      proposalType = 'core-slot';
      return;
    }
    if ('revoke_proposal' in stringMessage.propose) {
      proposalType = 'revoke-proposal';
      return;
    }

    if ('improvement' in stringMessage.propose) {
      proposalType = 'improvement';
      return;
    }

    if ('request_feature' in stringMessage.propose) {
      proposalType = 'feature-request';
      return;
    }
  });

  return {
    proposalType,
    excuteMsg,
  };
};

export const getProposalTypeForGovPublicProposals = (
  propsal: ProposalResponse,
) => {
  const propType = propsal.prop_type;
  if ('text' in propType) {
    return 'text';
  }
  if ('core_slot' in propType) {
    return 'core_slot';
  }
  if ('revoke_proposal' in propType) {
    return 'revoke_proposal';
  }
  if ('improvement' in propType) {
    return 'improvement';
  }
  if ('feature_request' in propType) {
    return 'feature_request';
  }
  return null;
};

export const calculateFundingPerMonth = (blocks: number) => {
  return ((blocks / 5) * 2629746).toFixed(0);
};
