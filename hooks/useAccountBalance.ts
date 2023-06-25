import { useQuery } from "@tanstack/react-query";
import { rest } from "../config/defaults";

const JMES_DENOM = "ujmes";
const BJMES_DENOM = "bujmes";
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
      console.log(data)
      const unstakedBalance =
        data.balances.find((i: any) => i.denom === JMES_DENOM)?.amount ?? 0;
      const stakedBalance =
        data.balances.find((i: any) => i.denom === BJMES_DENOM)?.amount ?? 0;
        console.log(stakedBalance)
      return {
        unstaked: unstakedBalance / 1000000,
        staked: stakedBalance / 1000000,
      };
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

export function formatBalance(value: number): string {
  if (value == 0) {
    return "0.0";
  }

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
