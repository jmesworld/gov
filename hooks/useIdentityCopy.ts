import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { useChain } from "@cosmos-kit/react";
import { useState } from "react";
import {
  IdentityserviceClient,
  IdentityserviceQueryClient,
} from "../client/Identityservice.client";
import {
  useIdentityserviceGetIdentityByNameQuery,
  useIdentityserviceGetIdentityByOwnerQuery,
  useIdentityserviceRegisterUserMutation,
} from "../client/Identityservice.react-query";
import { IDENTITY_SERVICE_CONTRACT, chainName } from "../config/defaults";
import { IdentityError, validateName } from "../utils/identity";
import { StdFee } from "@cosmjs/amino";
import { IDENTITY_HELPERS } from "../utils/identity";

interface IdentityHook {
  cosmWasmClient: CosmWasmClient;
  signingClient: SigningCosmWasmClient;
  identityNameInput: string;
  setIsIdentityNameAvailable: Function;
  validationResult: void | IdentityError;
  isIdentityNameAvailable: boolean;
}

const tx_fee: StdFee = {
  amount: [
    {
      denom: "ujmes",
      amount: "2",
    },
  ],
  gas: "1000000",
};

const useIdentity = async ({
  signingClient,
  identityNameInput,
  setIsIdentityNameAvailable,
  cosmWasmClient,
}: IdentityHook) => {
  const [identityName, setIdentityName] = useState<string>("");
  const { address } = useChain(chainName);

  const {
    validateName,
    isIdentityNameValid,
    isIdentityNameAvailable,
    getIdentityByOwner,
    getIdentityByName,
  } = IDENTITY_HELPERS;

  const handleMutation = useIdentityserviceRegisterUserMutation();

  const client = new IdentityserviceQueryClient(
    cosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
  );
  const idClient = new IdentityserviceClient(
    signingClient,
    address as string,
    IDENTITY_SERVICE_CONTRACT
  );

  const identity = await handleMutation.mutateAsync({
    client: idClient,
    msg: { name: identityNameInput },
    args: { fee: tx_fee },
  });

  const fetchIdentity = async () => {
    const identity = await getIdentityByOwner(client, address as string);

    return identity;
  };

  return {
    fetchIdentity,
    tx_fee,
    getIdentityByOwner,
    getIdentityByName,
    identityName,
    identity,
    isIdentityNameValid,
    handleMutation,
    idClient,
    client,
    validateName,
    isIdentityNameAvailable,
    setIsIdentityNameAvailable,
    identityNameInput,
    setIdentityName,
    cosmWasmClient,
    signingClient,
  };
};

export default useIdentity;
