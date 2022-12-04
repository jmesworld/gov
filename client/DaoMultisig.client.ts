/**
* This file was automatically generated by @jmes-cosmwasm/ts-codegen@0.14.2.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @jmes-cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { LCDClient, Coins, MnemonicKey, MsgExecuteContract, WaitTxBroadcastResult } from "@terra-money/terra.js";
import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
import { Executor, Addr, Duration, Threshold, Decimal, InstantiateMsg, ExecuteMsg, Expiration, Timestamp, Uint64, CosmosMsgForEmpty, BankMsg, Uint128, WasmMsg, Binary, Vote, Coin, Empty, MemberChangedHookMsg, MemberDiff, QueryMsg, ConfigResponse, VoteResponse, VoteInfo, Status, ThresholdResponse, ProposalListResponseForEmpty, ProposalResponseForEmpty, VoterListResponse, VoterDetail, VoteListResponse, VoterResponse } from "./DaoMultisig.types";
export interface DaoMultisigReadOnlyInterface {
  contractAddress: string;
  threshold: () => Promise<ThresholdResponse>;
  proposal: ({
    proposalId
  }: {
    proposalId: number;
  }) => Promise<ProposalResponseForEmpty>;
  listProposals: ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: number;
  }) => Promise<ProposalListResponseForEmpty>;
  reverseProposals: ({
    limit,
    startBefore
  }: {
    limit?: number;
    startBefore?: number;
  }) => Promise<ProposalListResponseForEmpty>;
  getVote: ({
    proposalId,
    voter
  }: {
    proposalId: number;
    voter: string;
  }) => Promise<VoteResponse>;
  listVotes: ({
    limit,
    proposalId,
    startAfter
  }: {
    limit?: number;
    proposalId: number;
    startAfter?: string;
  }) => Promise<VoteListResponse>;
  voter: ({
    address
  }: {
    address: string;
  }) => Promise<VoterResponse>;
  listVoters: ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<VoterListResponse>;
  config: () => Promise<ConfigResponse>;
}
export class DaoMultisigQueryClient implements DaoMultisigReadOnlyInterface {
  client: LCDClient;
  contractAddress: string;

  constructor(client: LCDClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.threshold = this.threshold.bind(this);
    this.proposal = this.proposal.bind(this);
    this.listProposals = this.listProposals.bind(this);
    this.reverseProposals = this.reverseProposals.bind(this);
    this.getVote = this.getVote.bind(this);
    this.listVotes = this.listVotes.bind(this);
    this.voter = this.voter.bind(this);
    this.listVoters = this.listVoters.bind(this);
    this.config = this.config.bind(this);
  }

  threshold = async (): Promise<ThresholdResponse> => {
    return this.client.wasm.contractQuery(this.contractAddress, {
      threshold: {}
    });
  };
  proposal = async ({
    proposalId
  }: {
    proposalId: number;
  }): Promise<ProposalResponseForEmpty> => {
    return this.client.wasm.contractQuery(this.contractAddress, {
      proposal: {
        proposal_id: proposalId
      }
    });
  };
  listProposals = async ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: number;
  }): Promise<ProposalListResponseForEmpty> => {
    return this.client.wasm.contractQuery(this.contractAddress, {
      list_proposals: {
        limit,
        start_after: startAfter
      }
    });
  };
  reverseProposals = async ({
    limit,
    startBefore
  }: {
    limit?: number;
    startBefore?: number;
  }): Promise<ProposalListResponseForEmpty> => {
    return this.client.wasm.contractQuery(this.contractAddress, {
      reverse_proposals: {
        limit,
        start_before: startBefore
      }
    });
  };
  getVote = async ({
    proposalId,
    voter
  }: {
    proposalId: number;
    voter: string;
  }): Promise<VoteResponse> => {
    return this.client.wasm.contractQuery(this.contractAddress, {
      get_vote: {
        proposal_id: proposalId,
        voter
      }
    });
  };
  listVotes = async ({
    limit,
    proposalId,
    startAfter
  }: {
    limit?: number;
    proposalId: number;
    startAfter?: string;
  }): Promise<VoteListResponse> => {
    return this.client.wasm.contractQuery(this.contractAddress, {
      list_votes: {
        limit,
        proposal_id: proposalId,
        start_after: startAfter
      }
    });
  };
  voter = async ({
    address
  }: {
    address: string;
  }): Promise<VoterResponse> => {
    return this.client.wasm.contractQuery(this.contractAddress, {
      voter: {
        address
      }
    });
  };
  listVoters = async ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<VoterListResponse> => {
    return this.client.wasm.contractQuery(this.contractAddress, {
      list_voters: {
        limit,
        start_after: startAfter
      }
    });
  };
  config = async (): Promise<ConfigResponse> => {
    return this.client.wasm.contractQuery(this.contractAddress, {
      config: {}
    });
  };
}
export interface DaoMultisigInterface extends DaoMultisigReadOnlyInterface {
  contractAddress: string;
  propose: ({
    description,
    latest,
    msgs,
    title
  }: {
    description: string;
    latest?: Expiration;
    msgs: CosmosMsgForEmpty[];
    title: string;
  }, coins?: Coins) => Promise<WaitTxBroadcastResult>;
  vote: ({
    proposalId,
    vote
  }: {
    proposalId: number;
    vote: Vote;
  }, coins?: Coins) => Promise<WaitTxBroadcastResult>;
  execute: ({
    proposalId
  }: {
    proposalId: number;
  }, coins?: Coins) => Promise<WaitTxBroadcastResult>;
  close: ({
    proposalId
  }: {
    proposalId: number;
  }, coins?: Coins) => Promise<WaitTxBroadcastResult>;
  memberChangedHook: ({
    diffs
  }: {
    diffs: MemberDiff[];
  }, coins?: Coins) => Promise<WaitTxBroadcastResult>;
}
export class DaoMultisigClient extends DaoMultisigQueryClient implements DaoMultisigInterface {
  client: LCDClient;
  user: any;
  contractAddress: string;

  constructor(client: LCDClient, user: any, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.user = user;
    this.contractAddress = contractAddress;
    this.propose = this.propose.bind(this);
    this.vote = this.vote.bind(this);
    this.execute = this.execute.bind(this);
    this.close = this.close.bind(this);
    this.memberChangedHook = this.memberChangedHook.bind(this);
  }

  propose = async ({
    description,
    latest,
    msgs,
    title
  }: {
    description: string;
    latest?: Expiration;
    msgs: CosmosMsgForEmpty[];
    title: string;
  }, coins?: Coins): Promise<WaitTxBroadcastResult> => {
    const key = new MnemonicKey(this.user.mnemonicKeyOptions);
    const wallet = this.client.wallet(key);
    const execMsg = new MsgExecuteContract(this.user.address, this.contractAddress, {
      propose: {
        description,
        latest,
        msgs,
        title
      }
    }, coins);
    const txOptions = { msgs: [execMsg] };
    const tx = await wallet.createAndSignTx(txOptions);
    return await this.client.tx.broadcast(tx);
  };
  vote = async ({
    proposalId,
    vote
  }: {
    proposalId: number;
    vote: Vote;
  }, coins?: Coins): Promise<WaitTxBroadcastResult> => {
    const key = new MnemonicKey(this.user.mnemonicKeyOptions);
    const wallet = this.client.wallet(key);
    const execMsg = new MsgExecuteContract(this.user.address, this.contractAddress, {
      vote: {
        proposal_id: proposalId,
        vote
      }
    }, coins);
    const txOptions = { msgs: [execMsg] };
    const tx = await wallet.createAndSignTx(txOptions);
    return await this.client.tx.broadcast(tx);
  };
  execute = async ({
    proposalId
  }: {
    proposalId: number;
  }, coins?: Coins): Promise<WaitTxBroadcastResult> => {
    const key = new MnemonicKey(this.user.mnemonicKeyOptions);
    const wallet = this.client.wallet(key);
    const execMsg = new MsgExecuteContract(this.user.address, this.contractAddress, {
      execute: {
        proposal_id: proposalId
      }
    }, coins);
    const txOptions = { msgs: [execMsg] };
    const tx = await wallet.createAndSignTx(txOptions);
    return await this.client.tx.broadcast(tx);
  };
  close = async ({
    proposalId
  }: {
    proposalId: number;
  }, coins?: Coins): Promise<WaitTxBroadcastResult> => {
    const key = new MnemonicKey(this.user.mnemonicKeyOptions);
    const wallet = this.client.wallet(key);
    const execMsg = new MsgExecuteContract(this.user.address, this.contractAddress, {
      close: {
        proposal_id: proposalId
      }
    }, coins);
    const txOptions = { msgs: [execMsg] };
    const tx = await wallet.createAndSignTx(txOptions);
    return await this.client.tx.broadcast(tx);
  };
  memberChangedHook = async ({
    diffs
  }: {
    diffs: MemberDiff[];
  }, coins?: Coins): Promise<WaitTxBroadcastResult> => {
    const key = new MnemonicKey(this.user.mnemonicKeyOptions);
    const wallet = this.client.wallet(key);
    const execMsg = new MsgExecuteContract(this.user.address, this.contractAddress, {
      member_changed_hook: {
        diffs
      }
    }, coins);
    const txOptions = { msgs: [execMsg] };
    const tx = await wallet.createAndSignTx(txOptions);
    return await this.client.tx.broadcast(tx);
  };
}