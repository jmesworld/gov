import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { useChain } from "@cosmos-kit/react";

import { useState, useEffect } from "react";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../client/Identityservice.react-query";
import { chainName, IDENTITY_SERVICE_CONTRACT } from "../config/defaults";
import { useInterval } from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";

export default function useClient() {
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient>();

  const { address, getCosmWasmClient, getSigningCosmWasmClient, status } =
    useChain(chainName);

  const identityserviceClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
  );

  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceClient,
    args: { owner: address ? address : "" },
  });
  //could possibly not be fetching in incorrect order?
  const getName = () => {
    const identityNameString = identityOwnerQuery.data?.identity?.name;

    return identityNameString;
  };
  const checkIdentity = () => {
    const isIdentityCreated = identityOwnerQuery.data?.identity;
    return isIdentityCreated;
  };
  const fetchSigningClient = async () => {
    const fetchedSigningClient = await getSigningCosmWasmClient();
    return { fetchedSigningClient: fetchedSigningClient };
  };
  const fetchCosmClient = async () => {
    const fetchedCosmWasmClient = await getCosmWasmClient();

    return {
      fetchedCosmWasmClient: fetchedCosmWasmClient,
    };
  };

  return {
    identityOwnerQuery,
    identityserviceClient,
    checkIdentity,
    fetchSigningClient,
    getName,
    fetchCosmClient,
  };
}
