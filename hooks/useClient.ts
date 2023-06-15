import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useChain } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { chainName, IDENTITY_SERVICE_CONTRACT } from "../config/defaults";
import { GovernanceQueryClient } from "../client/Governance.client";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../client/Identityservice.react-query";

const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export default function useClient() {
  const { address, getCosmWasmClient, getSigningCosmWasmClient } =
    useChain(chainName);
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>();
  useEffect(() => {
    if (address) {
      getCosmWasmClient()
        .then((cosmWasmClient) => {
          if (!cosmWasmClient || !address) {
            return;
          }
          setCosmWasmClient(cosmWasmClient);
        })
        .catch((error) => console.log(error));
    }
  }, [address, getCosmWasmClient]);

  const identityserviceClient = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
  );

  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceClient,
    args: { owner: address ? address : "" },
  });

  const handleGetIdentity = () => {
    const status = identityOwnerQuery.status;
    if (status == "success") {
      return identityOwnerQuery.data?.identity?.name;
    } else if (status == "loading") {
      return "loading";
    } else if (status == "error") {
      return "error";
    }
  };
  const checkIdentity = () => {
    const isIdentityCreated = identityOwnerQuery.data?.identity;
    return isIdentityCreated;
  };
  const fetchSigningCosmClient = async () => {
    const client = await getSigningCosmWasmClient();
    return {
      signingCosmWasmClient: client,
    };
  };

  const fetchCosmClient = async () => {
    const client = await getCosmWasmClient();

    return {
      cosmWasmClient: client,
    };
  };

  const fetchGovernanceClient = async () => {
    getCosmWasmClient().then((cosmWasmClient) => {
      if (!cosmWasmClient) {
        return;
      }
      const governanceClient = new GovernanceQueryClient(
        cosmWasmClient,
        NEXT_PUBLIC_GOVERNANCE_CONTRACT
      );
      return { governanceClient };
    });
  };
  return {
    identityOwnerQuery,
    identityserviceClient,
    checkIdentity,
    fetchSigningCosmClient,
    handleGetIdentity,
    fetchCosmClient,
    fetchGovernanceClient,
  };
}
