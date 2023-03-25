import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useQuery } from "@tanstack/react-query";
import { rest } from "../config/defaults";

export function useAccountBalance(address: string) {
  return useQuery(
    ["accountBalance"],
    () => {
      //
      return fetch(`${rest}/cosmos/bank/v1beta1/balances/${address}`);
    },
    {
      onSuccess: (data) => {
        //console.log(data);
      },
      refetchInterval: 10,
    }
  );
}
