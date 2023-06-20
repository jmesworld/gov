import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../client/Identityservice.react-query";
import { IDENTITY_SERVICE_CONTRACT, chainName } from "../config/defaults";
import { useChain } from "@cosmos-kit/react";
import { useState, useEffect } from "react";

export interface CosmWasmClientContext {
  walletAddress: string;
  cosmWasmClient: CosmWasmClient | null;
  signingClient: SigningCosmWasmClient | null;
  loading: boolean;
  error: any;
  disconnect: Function;
  identityOwnerQuery: any;
  identityName: any;
}

export const useClientIdentity = (): CosmWasmClientContext => {
  const { address, getCosmWasmClient, getSigningCosmWasmClient } =
    useChain(chainName);

  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(
    null
  );
  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState(address as string);

  const connectCosmWalletClient = async () => {
    const cosmClient = await getCosmWasmClient();
    setCosmWasmClient(cosmClient);
    return cosmClient;
  };
  const connectSigningCosmWalletClient = async () => {
    const signingCosmClient = await getSigningCosmWasmClient();
    setSigningClient(signingCosmClient);
    return signingCosmClient;
  };

  const connectWalletClient = async () => {
    setLoading(true);
    try {
      const cosmClient = await connectCosmWalletClient();
      const signingCosmClient = await connectSigningCosmWalletClient();
      return { cosmClient, signingCosmClient };
    } catch (error) {
      setError(error);
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWalletClient();

    // connectWalletClient().then(({ cosmClient, signingCosmClient }) => {
    //   setCosmWasmClient(cosmClient);
    //   setSigningClient(signingCosmClient);
    //   setWalletAddress(address as string);
    //   setLoading(false);
    // });
  }, []);

  const disconnect = () => {
    if (cosmWasmClient) {
      cosmWasmClient.disconnect();
    }
    setWalletAddress("");
    setCosmWasmClient(null);
    setLoading(false);
  };

  const identityserviceClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
  );

  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceClient,
    args: { owner: walletAddress },
    options: {
      refetchOnMount: true,
    },
  });

  const identityName = identityOwnerQuery.data?.identity?.name;

  return {
    signingClient,
    cosmWasmClient,
    loading,
    error,
    walletAddress,
    disconnect,
    identityOwnerQuery,
    identityName,
  };
};
