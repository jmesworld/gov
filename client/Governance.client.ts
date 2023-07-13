/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
import { Addr, Uint128, ConfigResponse, ExecuteMsg, ProposalMsg, Feature, CosmosMsgForEmpty, BankMsg, StakingMsg, DistributionMsg, Binary, IbcMsg, Timestamp, Uint64, WasmMsg, GovMsg, VoteOption, CoreSlot, Funding, Coin, Empty, IbcTimeout, IbcTimeoutBlock, Decimal, GovernanceCoreSlotsResponse, SlotVoteResult, InstantiateMsg, ProposalPeriod, PeriodInfoResponse, ProposalType, ProposalStatus, ProposalResponse, ProposalsResponse, QueryMsg, WinningGrantsResponse, WinningGrant } from "./Governance.types";
export interface GovernanceReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<ConfigResponse>;
  periodInfo: () => Promise<PeriodInfoResponse>;
  proposal: ({
    id
  }: {
    id: number;
  }) => Promise<ProposalResponse>;
  proposals: ({
    limit,
    start
  }: {
    limit?: number;
    start?: number;
  }) => Promise<ProposalsResponse>;
  coreSlots: () => Promise<CoreSlotsResponse>;
  winningGrants: () => Promise<WinningGrantsResponse>;
}
export class GovernanceQueryClient implements GovernanceReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
    this.periodInfo = this.periodInfo.bind(this);
    this.proposal = this.proposal.bind(this);
    this.proposals = this.proposals.bind(this);
    this.coreSlots = this.coreSlots.bind(this);
    this.winningGrants = this.winningGrants.bind(this);
  }

  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
  periodInfo = async (): Promise<PeriodInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      period_info: {}
    });
  };
  proposal = async ({
    id
  }: {
    id: number;
  }): Promise<ProposalResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      proposal: {
        id
      }
    });
  };
  proposals = async ({
    limit,
    start
  }: {
    limit?: number;
    start?: number;
  }): Promise<ProposalsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      proposals: {
        limit,
        start
      }
    });
  };
  coreSlots = async (): Promise<CoreSlotsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      core_slots: {}
    });
  };
  winningGrants = async (): Promise<WinningGrantsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      winning_grants: {}
    });
  };
}
export interface GovernanceInterface extends GovernanceReadOnlyInterface {
  contractAddress: string;
  sender: string;
  propose: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  vote: ({
    id,
    vote
  }: {
    id: number;
    vote: VoteOption;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  conclude: ({
    id
  }: {
    id: number;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  setContract: ({
    artDealer,
    identityservice
  }: {
    artDealer: string;
    identityservice: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  setCoreSlot: ({
    proposalId
  }: {
    proposalId: number;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  unsetCoreSlot: ({
    proposalId
  }: {
    proposalId: number;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  resignCoreSlot: ({
    note,
    slot
  }: {
    note: string;
    slot: CoreSlot;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class GovernanceClient extends GovernanceQueryClient implements GovernanceInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.propose = this.propose.bind(this);
    this.vote = this.vote.bind(this);
    this.conclude = this.conclude.bind(this);
    this.setContract = this.setContract.bind(this);
    this.setCoreSlot = this.setCoreSlot.bind(this);
    this.unsetCoreSlot = this.unsetCoreSlot.bind(this);
    this.resignCoreSlot = this.resignCoreSlot.bind(this);
  }

  propose = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      propose: {}
    }, fee, memo, funds);
  };
  vote = async ({
    id,
    vote
  }: {
    id: number;
    vote: VoteOption;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      vote: {
        id,
        vote
      }
    }, fee, memo, funds);
  };
  conclude = async ({
    id
  }: {
    id: number;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      conclude: {
        id
      }
    }, fee, memo, funds);
  };
  setContract = async ({
    artDealer,
    identityservice
  }: {
    artDealer: string;
    identityservice: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      set_contract: {
        art_dealer: artDealer,
        identityservice
      }
    }, fee, memo, funds);
  };
  setCoreSlot = async ({
    proposalId
  }: {
    proposalId: number;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      set_core_slot: {
        proposal_id: proposalId
      }
    }, fee, memo, funds);
  };
  unsetCoreSlot = async ({
    proposalId
  }: {
    proposalId: number;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      unset_core_slot: {
        proposal_id: proposalId
      }
    }, fee, memo, funds);
  };
  resignCoreSlot = async ({
    note,
    slot
  }: {
    note: string;
    slot: CoreSlot;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      resign_core_slot: {
        note,
        slot
      }
    }, fee, memo, funds);
  };
}