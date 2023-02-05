/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import { Duration, Decimal, InstantiateMsg, Member, ExecuteMsg, QueryMsg, AdminResponse, Threshold, ConfigResponse, HooksResponse, MemberListResponse, MemberResponse, TotalWeightResponse } from "./DaoMembers.types";
export interface DaoMembersReadOnlyInterface {
  contractAddress: string;
  admin: () => Promise<AdminResponse>;
  totalWeight: ({
    atHeight
  }: {
    atHeight?: number;
  }) => Promise<TotalWeightResponse>;
  listMembers: ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<MemberListResponse>;
  member: ({
    addr,
    atHeight
  }: {
    addr: string;
    atHeight?: number;
  }) => Promise<MemberResponse>;
  hooks: () => Promise<HooksResponse>;
  config: () => Promise<ConfigResponse>;
}
export class DaoMembersQueryClient implements DaoMembersReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.admin = this.admin.bind(this);
    this.totalWeight = this.totalWeight.bind(this);
    this.listMembers = this.listMembers.bind(this);
    this.member = this.member.bind(this);
    this.hooks = this.hooks.bind(this);
    this.config = this.config.bind(this);
  }

  admin = async (): Promise<AdminResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      admin: {}
    });
  };
  totalWeight = async ({
    atHeight
  }: {
    atHeight?: number;
  }): Promise<TotalWeightResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      total_weight: {
        at_height: atHeight
      }
    });
  };
  listMembers = async ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<MemberListResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      list_members: {
        limit,
        start_after: startAfter
      }
    });
  };
  member = async ({
    addr,
    atHeight
  }: {
    addr: string;
    atHeight?: number;
  }): Promise<MemberResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      member: {
        addr,
        at_height: atHeight
      }
    });
  };
  hooks = async (): Promise<HooksResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      hooks: {}
    });
  };
  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
}
export interface DaoMembersInterface extends DaoMembersReadOnlyInterface {
  contractAddress: string;
  sender: string;
  updateAdmin: ({
    admin
  }: {
    admin?: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  updateMembers: ({
    add,
    remove
  }: {
    add: Member[];
    remove: string[];
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  addHook: ({
    addr
  }: {
    addr: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  removeHook: ({
    addr
  }: {
    addr: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class DaoMembersClient extends DaoMembersQueryClient implements DaoMembersInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.updateAdmin = this.updateAdmin.bind(this);
    this.updateMembers = this.updateMembers.bind(this);
    this.addHook = this.addHook.bind(this);
    this.removeHook = this.removeHook.bind(this);
  }

  updateAdmin = async ({
    admin
  }: {
    admin?: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_admin: {
        admin
      }
    }, fee, memo, funds);
  };
  updateMembers = async ({
    add,
    remove
  }: {
    add: Member[];
    remove: string[];
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_members: {
        add,
        remove
      }
    }, fee, memo, funds);
  };
  addHook = async ({
    addr
  }: {
    addr: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      add_hook: {
        addr
      }
    }, fee, memo, funds);
  };
  removeHook = async ({
    addr
  }: {
    addr: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      remove_hook: {
        addr
      }
    }, fee, memo, funds);
  };
}