import { useQuery } from "@tanstack/react-query";
import { rest } from "../config/defaults";

export function useAccountBalance(address: string) {
  return useQuery(
    ["accountBalance", address],
    async () => {
      const requestUrl = `${rest}/cosmos/bank/v1beta1/balances/${address}`;

      const response = await fetch(requestUrl);
      if (!response.ok) {
        console.error(response);
        throw new Error("Failed to fetch account balance");
      }
      const data = await response.json();
      const balance = data.balances.length === 0 ? 0 : data.balances[0].amount;
      return balance / 1000000;
    },
    {
      onSuccess: (data) => {
        return data;
      },
      onError: (error) => {
        console.error(error);
      },
      refetchInterval: 60 * 1000,
    }
  );
}

export function useStakedBalance(address: string) {
  return useQuery(
    ["stakedBalance", address],
    async () => {
      const requestUrl = `${rest}/cosmos/staking/v1beta1/delegations/${address}`;

      const response = await fetch(requestUrl);
      if (!response.ok) {
        console.error(response);
        throw new Error("Failed to fetch account balance");
      }
      const data = await response.json();
      const balance =
        data.delegation_responses.length === 0
          ? 0
          : data.delegation_responses[0].balance.amount;
      return balance / 1000000;
    },
    {
      onSuccess: (data) => {
         return data;
      },
      onError: (error) => {
        console.error(error);
      },
      refetchInterval: 6 * 1000,
    }
  );
}


export function formatBalance(value: number): string {
  if(value == 0) {return "0.0";}

  const suffixes = ["", "k", "m", "b", "t"];
  const base = Math.floor(Math.log10(Math.abs(value)) / 3);
  const suffix = suffixes[base];
  const scaledValue = value / Math.pow(10, base * 3);

  const formattedValue = scaledValue.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return `${formattedValue}${suffix}`;
}