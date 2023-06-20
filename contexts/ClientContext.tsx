import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  CosmWasmClientContext,
  useClientIdentity,
} from "../hooks/useClientIdentity";

let CosmWasmContext: any;
let { Provider } = (CosmWasmContext = createContext<CosmWasmClientContext>({
  walletAddress: "",
  cosmWasmClient: null,
  signingClient: null,
  loading: false,
  error: null,
  disconnect: () => {},
  identityOwnerQuery: null,
  identityName: null,
}));

export const useCosmWasmClient = (): CosmWasmClientContext =>
  useContext(CosmWasmContext);

export const CosmWasmProvider = ({ children }: { children: ReactNode }) => {
  const value = useCosmWasmClient();
  return <Provider value={value}>{children}</Provider>;
};
