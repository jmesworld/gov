import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';
import {
  IdentityserviceQueryClient,
  IdentityserviceClient,
} from '../client/Identityservice.client';
import {
  useIdentityserviceGetIdentityByNameQuery,
  useIdentityserviceGetIdentityByOwnerQuery,
} from '../client/Identityservice.react-query';
import { IDENTITY_SERVICE_CONTRACT } from '../config/defaults';

export interface IdentityError {
  message?: string;
  name:
    | 'NameTooShort'
    | 'NameTooLong'
    | 'NameHasUpperCase'
    | 'InvalidCharacter';
  length?: number;
  min_length?: number;
  max_length?: number;
  c?: string;
}

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 32;
const invalid_char = /[^a-zA-Z0-9_]/;

export const IDENTITY_HELPERS = {
  validateName: (name: string) => {
    const validationResult = validateName(name);
    return validationResult;
  },
  isIdentityNameValid: (validationResult: void | IdentityError) => {
    return !validationResult?.name;
  },
  isIdentityNameAvailable: (i: any) => {
    return !i?.data?.identity?.name.toString();
  },
  getIdentityByOwner: async (
    client: IdentityserviceQueryClient,
    address: string,
  ) => {
    const identity = await client.getIdentityByOwner({ owner: address });
    return identity;
  },
  getIdentityByName: async (
    client: IdentityserviceQueryClient,
    name: string,
  ) => {
    const identity = await client.getIdentityByName({ name });
    return identity;
  },

  signingClient: SigningCosmWasmClient,
  cosmWasmClient: CosmWasmClient,

  setCosmWasmClient: (cosmWasmClient: any) => {
    const client = new IdentityserviceQueryClient(
      cosmWasmClient,
      IDENTITY_SERVICE_CONTRACT,
    );
    return client;
  },

  setSigningClient: (signingClient: any, address: any) => {
    const idClient = new IdentityserviceClient(
      signingClient as SigningCosmWasmClient,
      address as string,
      IDENTITY_SERVICE_CONTRACT,
    );
    return idClient;
  },
  setIdentityNameInput: (identityNameInput: string) => {
    return identityNameInput;
  },
  useIdentityserviceGetIdentityByNameQuery: ({ client, args }: any) => {
    return useIdentityserviceGetIdentityByNameQuery({
      client: IDENTITY_HELPERS.setSigningClient(client, args),
      args: { name: args },
      options: {
        onSuccess: (data: any) => {
          if (!data?.identity?.name.toString()) {
            return true;
          }
        },
        enabled: args?.length > 2,
      },
    });
  },

  useIdentityserviceGetIdentityByOwnerQuery: ({ client, args }: any) => {
    return useIdentityserviceGetIdentityByOwnerQuery({
      client: IDENTITY_HELPERS.setCosmWasmClient(client),
      args: { owner: args },
      options: {
        refetchInterval: 5000,
        onSuccess: (data: any) => {
          const identityName = data?.identity?.name as string;
          return identityName;
        },
      },
    });
  },
};

export function validateName(name: string): undefined | IdentityError {
  const length = name.length;
  if (length < MIN_NAME_LENGTH) {
    return {
      message: 'Name is too short',
      name: 'NameTooShort',
      length,
      min_length: MIN_NAME_LENGTH,
    };
  } else if (length > MAX_NAME_LENGTH) {
    return {
      message: 'Name is too long',
      name: 'NameTooLong',
      length,
      max_length: MAX_NAME_LENGTH,
    };
  } else if (/[A-Z]/.test(name)) {
    return {
      message: 'Name contains uppercase letter',
      name: 'NameHasUpperCase',
      length,
      max_length: MAX_NAME_LENGTH,
    };
  } else {
    const bytepos_invalid_char_start = name.search(invalid_char);
    if (bytepos_invalid_char_start === -1) {
      return;
    } else {
      const c = name[bytepos_invalid_char_start];
      return {
        message: 'Name contains invalid character',
        name: 'InvalidCharacter',
        c,
      };
    }
  }
}

export function countObjectsWithDuplicateNames(
  objects: { name: string; address: string; votingPower: number }[],
): number {
  const nameCounts: Record<string, number> = {};

  // Count the occurrences of each name
  for (const obj of objects) {
    if (obj.name in nameCounts && obj.name.length > 0) {
      nameCounts[obj.name]++;
    } else {
      nameCounts[obj.name] = 1;
    }
  }

  // Count the objects with duplicate names
  let count = 0;
  for (const name in nameCounts) {
    if (nameCounts[name] > 1) {
      count++;
    }
  }

  return count;
}

export function toBase64(obj: any) {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}

export function fromBase64ToString<T>(base64: string): T {
  const json = Buffer.from(base64, 'base64').toString('utf8');
  return JSON.parse(json);
}
