import { ProposalResponseForEmpty } from '../client/DaoMultisig.types';
import { GovernanceQueryClient } from '../client/Governance.client';
import { ProposalMsg, ProposalResponse } from '../client/Governance.types';
import { fromBase64ToString } from './identity';
import { z } from 'zod';

export const getProposalExcuteMsg = (
  proposal: ProposalResponseForEmpty,
): {
  excuteMsg: { propose: ProposalMsg } | null;
  excuteMsgs: ProposalResponseForEmpty['msgs'];
  contractAddr: string | null;
  msgs: ProposalResponseForEmpty['msgs'];
} => {
  const excuteMsgs: ProposalResponseForEmpty['msgs'] = [];
  let excuteMsg: { propose: ProposalMsg } | null = null;
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
    excuteMsg = stringMessage;
    if (!stringMessage) {
      return;
    }
    excuteMsgs.push({
      ...msg,
      wasm: {
        ...wasm,
        execute: {
          ...wasm.execute,
          // Assinging a decoded object to msg
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /// @ts-ignore
          msg: stringMessage,
        },
      },
    });

    contractAddr = wasm.execute.contract_addr;
  });

  return {
    excuteMsg,
    excuteMsgs,
    contractAddr,
    msgs: proposal.msgs,
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

export const getFunding = (proposal: ProposalResponseForEmpty) => {
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
  return ((blocks * 5) / 2629745).toFixed(0);
};

const msgSchema = z.array(z.object({}));

export const parseMsg = (msg: string) => {
  try {
    const parsedMsg = JSON.parse(msg);
    const parsed = msgSchema.safeParse(parsedMsg);
    if (parsed.success) {
      return parsed.data;
    }
  } catch (e) {
    throw new Error('Invalid Improvement Message format ');
  }
  throw new Error('Invalid msg');
};
