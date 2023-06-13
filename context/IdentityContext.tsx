import { createContext, useContext, ReactNode } from "react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { IdentityserviceQueryClient } from "../client/Identityservice.client";
import { useIdentityserviceGetIdentityByOwnerQuery } from "../client/Identityservice.react-query";
import useClient from "../hooks/useClient";
interface IdentityContextProps {
  identityserviceQueryClient: IdentityserviceQueryClient;
  identityOwnerQuery: any;
}

interface IdentityProviderProps {
  children: ReactNode;
  cosmWasmClient: CosmWasmClient;
  address: string | undefined;
}

const IdentityContext = createContext<IdentityContextProps | undefined>(
  undefined
);

export const useIdentity = () => {
  const context = useContext(IdentityContext);
  if (!context) {
    throw new Error("useIdentity must be used within a IdentityProvider");
  }
  return context;
};

export const IdentityProvider = ({
  children,
  cosmWasmClient,
  address,
}: IdentityProviderProps): JSX.Element => {
  const IDENTITY_SERVICE_CONTRACT = process.env
    .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
  const { data } = useClient();

  const identityserviceQuery = new IdentityserviceQueryClient(
    cosmWasmClient as CosmWasmClient,
    IDENTITY_SERVICE_CONTRACT
  );
  const identityserviceQueryClient = identityserviceQuery;
  const identityOwnerQuery = useIdentityserviceGetIdentityByOwnerQuery({
    client: identityserviceQuery,
    args: { owner: address ? address : "" },
    options: {
      refetchInterval: 5000,
      onSuccess: (data) => {},
    },
  });

  return (
    <IdentityContext.Provider
      value={{ identityserviceQueryClient, identityOwnerQuery }}
    >
      {children}
    </IdentityContext.Provider>
  );
};
