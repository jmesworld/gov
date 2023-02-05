/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Addr = string;
export interface ConfigResponse {
  identityservice_contract: Addr;
  owner: Addr;
  [k: string]: unknown;
}
export type ExecuteMsg = {
  add_grant: {
    amount: Uint128;
    dao: Addr;
    duration: number;
    [k: string]: unknown;
  };
} | {
  claim: {
    grant_id: number;
    [k: string]: unknown;
  };
};
export type Uint128 = string;
export type Timestamp = Uint64;
export type Uint64 = string;
export interface GrantResponse {
  amount_approved: Uint128;
  amount_remaining: Uint128;
  claimable_amount: Uint128;
  dao: Addr;
  expires: Timestamp;
  grant_id: number;
  started: Timestamp;
  [k: string]: unknown;
}
export interface GrantsResponse {
  grants: Grant[];
  [k: string]: unknown;
}
export interface Grant {
  amount_approved: Uint128;
  amount_remaining: Uint128;
  dao: Addr;
  expires: Timestamp;
  grant_id: number;
  started: Timestamp;
  [k: string]: unknown;
}
export interface InstantiateMsg {
  identityservice_contract: Addr;
  owner: Addr;
  [k: string]: unknown;
}
export type QueryMsg = {
  config: {
    [k: string]: unknown;
  };
} | {
  grant: {
    grant_id: number;
    [k: string]: unknown;
  };
} | {
  grants: {
    dao?: Addr | null;
    limit?: number | null;
    start_after?: string | null;
    [k: string]: unknown;
  };
};