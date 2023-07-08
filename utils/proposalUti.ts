import { ProposalListResponseForEmpty } from '../client/DaoMultisig.types';
import { GovernanceQueryClient } from '../client/Governance.client';

export const isProposalGov = (
  proposal: ProposalListResponseForEmpty['proposals'][0],
  client: GovernanceQueryClient,
) => {
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

    contractAddr = wasm.execute.contract_addr;
  });
  if (!contractAddr) {
    return false;
  }

  return client.contractAddress.includes(contractAddr);
};
