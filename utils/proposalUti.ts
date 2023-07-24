import { ProposalResponseForEmpty } from '../client/DaoMultisig.types';
import { GovernanceQueryClient } from '../client/Governance.client';
import {
  BankMsg,
  ProposalMsg,
  ProposalResponse,
} from '../client/Governance.types';
import { fromBase64ToString } from './identity';
import { z } from 'zod';

export const getProposalExcuteMsg = (
  proposal: ProposalResponseForEmpty | ProposalResponse,
): {
  bankMsg: BankMsg[] | null;
  excuteMsg: { propose: ProposalMsg } | null;
  excuteMsgs: ProposalResponseForEmpty['msgs'];
  contractAddr: string | null;
  msgs: ProposalResponseForEmpty['msgs'];
} => {
  const excuteMsgs: ProposalResponseForEmpty['msgs'] = [];
  let excuteMsg: { propose: ProposalMsg } | null = null;
  const bankMsg: BankMsg[] = [];
  let contractAddr: null | string = null;
  proposal?.msgs?.forEach(msg => {
    if (!msg) {
      return;
    }
    if ('bank' in msg) {
      bankMsg.push(msg.bank);
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
    bankMsg: bankMsg.length > 0 ? bankMsg : null,
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
  bankMsg: BankMsg[] | null;
} => {
  let proposalType: null | string = null;
  const { excuteMsg, bankMsg } = getProposalExcuteMsg(proposal);
  if (!excuteMsg || !('propose' in excuteMsg)) {
    return {
      proposalType,
      excuteMsg,
      bankMsg,
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
    bankMsg,
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

export const getDaoProposalType = (proposal: ProposalResponseForEmpty) => {
  const msgs = proposal.msgs;

  if (!msgs) {
    return null;
  }

  const msg = msgs[0];
  if (!msg) {
    return 'text';
  }

  if ('bank' in msg) {
    return 'spend_funds';
  }

  if ('wasm' in msg) {
    const wasm = msg.wasm;
    if ('execute' in wasm) {
      const execute = wasm.execute;
      if ('msg' in execute) {
        const msg = execute.msg;
        const parsedMsg = fromBase64ToString<object>(msg);
        if (parsedMsg && 'update_members' in parsedMsg) {
          return 'update_directors';
        }
      }
    }
  }

  return null;
};
