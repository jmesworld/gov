/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import {
  CosmWasmClient,
  SigningCosmWasmClient,
  ExecuteResult,
} from '@cosmjs/cosmwasm-stargate';
import { StdFee } from '@cosmjs/amino';
import {
  Executor,
  Addr,
  Duration,
  Threshold,
  Decimal,
  InstantiateMsg,
  ExecuteMsg,
  Expiration,
  Timestamp,
  Uint64,
  CosmosMsgForEmpty,
  BankMsg,
  Uint128,
  WasmMsg,
  Binary,
  Vote,
  Coin,
  Empty,
  MemberChangedHookMsg,
  MemberDiff,
  QueryMsg,
  ConfigResponse,
  VoteResponse,
  VoteInfo,
  Status,
  ThresholdResponse,
  ProposalListResponseForEmpty,
  ProposalResponseForEmpty,
  VoterListResponse,
  VoterDetail,
  VoteListResponse,
  VoterResponse,
} from './DaoMultisig.types';
export interface DaoMultisigReadOnlyInterface {
  contractAddress: string;
  threshold: () => Promise<ThresholdResponse>;
  proposal: ({
    proposalId,
  }: {
    proposalId: number;
  }) => Promise<ProposalResponseForEmpty>;
  listProposals: ({
    limit,
    startAfter,
  }: {
    limit?: number;
    startAfter?: number;
  }) => Promise<ProposalListResponseForEmpty>;
  reverseProposals: ({
    limit,
    startBefore,
  }: {
    limit?: number;
    startBefore?: number;
  }) => Promise<ProposalListResponseForEmpty>;
  getVote: ({
    proposalId,
    voter,
  }: {
    proposalId: number;
    voter: string;
  }) => Promise<VoteResponse>;
  listVotes: ({
    limit,
    proposalId,
    startAfter,
  }: {
    limit?: number;
    proposalId: number;
    startAfter?: string;
  }) => Promise<VoteListResponse>;
  voter: ({ address }: { address: string }) => Promise<VoterResponse>;
  listVoters: ({
    limit,
    startAfter,
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<VoterListResponse>;
  config: () => Promise<ConfigResponse>;
}
export class DaoMultisigQueryClient implements DaoMultisigReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
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
    return this.client.queryContractSmart(this.contractAddress, {
      threshold: {},
    });
  };
  proposal = async ({
    proposalId,
  }: {
    proposalId: number;
  }): Promise<ProposalResponseForEmpty> => {
    return this.client.queryContractSmart(this.contractAddress, {
      proposal: {
        proposal_id: proposalId,
      },
    });
  };
  listProposals = async ({
    limit,
    startAfter,
  }: {
    limit?: number;
    startAfter?: number;
  }): Promise<ProposalListResponseForEmpty> => {
    return this.client.queryContractSmart(this.contractAddress, {
      list_proposals: {
        limit,
        start_after: startAfter,
      },
    });
  };
  reverseProposals = async ({
    limit,
    startBefore,
  }: {
    limit?: number;
    startBefore?: number;
  }): Promise<ProposalListResponseForEmpty> => {
    return this.client.queryContractSmart(this.contractAddress, {
      reverse_proposals: {
        limit,
        start_before: startBefore,
      },
    });
  };
  getVote = async ({
    proposalId,
    voter,
  }: {
    proposalId: number;
    voter: string;
  }): Promise<VoteResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_vote: {
        proposal_id: proposalId,
        voter,
      },
    });
  };
  listVotes = async ({
    limit,
    proposalId,
    startAfter,
  }: {
    limit?: number;
    proposalId: number;
    startAfter?: string;
  }): Promise<VoteListResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      list_votes: {
        limit,
        proposal_id: proposalId,
        start_after: startAfter,
      },
    });
  };
  voter = async ({ address }: { address: string }): Promise<VoterResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      voter: {
        address,
      },
    });
  };
  listVoters = async ({
    limit,
    startAfter,
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<VoterListResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      list_voters: {
        limit,
        start_after: startAfter,
      },
    });
  };
  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {},
    });
  };
}
export interface DaoMultisigInterface extends DaoMultisigReadOnlyInterface {
  contractAddress: string;
  sender: string;
  propose: (
    {
      description,
      latest,
      msgs,
      title,
    }: {
      description: string;
      latest?: Expiration;
      msgs: CosmosMsgForEmpty[];
      title: string;
    },
    fee?: number | StdFee | 'auto',
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  vote: (
    {
      proposalId,
      vote,
    }: {
      proposalId: number;
      vote: Vote;
    },
    fee?: number | StdFee | 'auto',
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  execute: (
    {
      proposalId,
    }: {
      proposalId: number;
    },
    fee?: number | StdFee | 'auto',
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  close: (
    {
      proposalId,
    }: {
      proposalId: number;
    },
    fee?: number | StdFee | 'auto',
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  memberChangedHook: (
    {
      diffs,
    }: {
      diffs: MemberDiff[];
    },
    fee?: number | StdFee | 'auto',
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
}
export class DaoMultisigClient
  extends DaoMultisigQueryClient
  implements DaoMultisigInterface
{
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(
    client: SigningCosmWasmClient,
    sender: string,
    contractAddress: string,
  ) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.propose = this.propose.bind(this);
    this.vote = this.vote.bind(this);
    this.execute = this.execute.bind(this);
    this.close = this.close.bind(this);
    this.memberChangedHook = this.memberChangedHook.bind(this);
  }

  propose = async (
    {
      description,
      latest,
      msgs,
      title,
    }: {
      description: string;
      latest?: Expiration;
      msgs: CosmosMsgForEmpty[];
      title: string;
    },
    fee: number | StdFee | 'auto' = 'auto',
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        propose: {
          description,
          latest,
          msgs,
          title,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  vote = async (
    {
      proposalId,
      vote,
    }: {
      proposalId: number;
      vote: Vote;
    },
    fee: number | StdFee | 'auto' = 'auto',
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        vote: {
          proposal_id: proposalId,
          vote,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  execute = async (
    {
      proposalId,
    }: {
      proposalId: number;
    },
    fee: number | StdFee | 'auto' = 'auto',
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        execute: {
          proposal_id: proposalId,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  close = async (
    {
      proposalId,
    }: {
      proposalId: number;
    },
    fee: number | StdFee | 'auto' = 'auto',
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        close: {
          proposal_id: proposalId,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  memberChangedHook = async (
    {
      diffs,
    }: {
      diffs: MemberDiff[];
    },
    fee: number | StdFee | 'auto' = 'auto',
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        member_changed_hook: {
          diffs,
        },
      },
      fee,
      memo,
      funds,
    );
  };
}
