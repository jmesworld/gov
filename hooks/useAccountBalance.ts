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
        console.log(data);
        return data;
      },
      onError: (error) => {
        console.error(error);
      },
      refetchInterval: 60 * 1000,
    }
  );
}
