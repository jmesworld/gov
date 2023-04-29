import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useQuery } from "@tanstack/react-query";
import { rest } from "../config/defaults";

export function useAccountBalance(address: string) {
  return useQuery(
    ["accountBalance", address],
    async () => {
      const request_url = `${rest}/cosmos/bank/v1beta1/balances/${
        address as string
      }`;
      const response = await fetch(request_url);
      if (!response.ok) {
        throw new Error("Failed to fetch account balance");
      }
      const data = await response.json();
      const balance = !!data && data.balances.length === 0 ? 0 : data.balances[0].amount
      return balance / 1000000;
    },
    {
      onSuccess: (data) => {
      },
      onError: (error) => {
        console.log(error);
      },
      refetchInterval: 100000,
    }
  );
}
