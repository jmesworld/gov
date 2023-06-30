/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

export type Addr = string;
export type Duration =
  | {
      height: number;
    }
  | {
      time: number;
    };
export type Decimal = string;
export interface InstantiateMsg {
  dao_name: string;
  governance_addr: Addr;
  max_voting_period: Duration;
  members: Member[];
  threshold_percentage: Decimal;
}
export interface Member {
  addr: string;
  weight: number;
}
export type ExecuteMsg =
  | {
      update_admin: {
        admin?: string | null;
      };
    }
  | {
      update_members: {
        add: Member[];
        remove: string[];
      };
    }
  | {
      add_hook: {
        addr: string;
      };
    }
  | {
      remove_hook: {
        addr: string;
      };
    };
export type QueryMsg =
  | {
      admin: {};
    }
  | {
      total_weight: {
        at_height?: number | null;
      };
    }
  | {
      list_members: {
        limit?: number | null;
        start_after?: string | null;
      };
    }
  | {
      member: {
        addr: string;
        at_height?: number | null;
      };
    }
  | {
      hooks: {};
    }
  | {
      config: {};
    };
export interface AdminResponse {
  admin?: string | null;
}
export type Threshold =
  | {
      absolute_count: {
        weight: number;
      };
    }
  | {
      absolute_percentage: {
        percentage: Decimal;
      };
    }
  | {
      threshold_quorum: {
        quorum: Decimal;
        threshold: Decimal;
      };
    };
export interface ConfigResponse {
  dao_name: string;
  max_voting_period: Duration;
  threshold: Threshold;
}
export interface HooksResponse {
  hooks: string[];
}
export interface MemberListResponse {
  members: Member[];
}
export interface MemberResponse {
  weight?: number | null;
}
export interface TotalWeightResponse {
  weight: number;
}
