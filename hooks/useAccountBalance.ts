import { useQuery } from '@tanstack/react-query';
import { rest } from '../config/defaults';

const JMES_DENOM = 'ujmes';
const BJMES_DENOM = 'bujmes';
export function useAccountBalance(
  address: string | undefined,
  refetchInterval = 60 * 1000,
  enabled = true,
) {
  return useQuery(
    ['accountBalance', address],
    async () => {
      const requestUrl = `${rest}/cosmos/bank/v1beta1/balances/${address}`;

      const response = await fetch(requestUrl);
      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to fetch account balance');
      }
      const data = await response.json();
      const unstakedBalance =
        data.balances.find((i: any) => i.denom === JMES_DENOM)?.amount ?? 0;
      const stakedBalance =
        data.balances.find((i: any) => i.denom === BJMES_DENOM)?.amount ?? 0;
      return {
        unstaked: unstakedBalance / 1000000,
        staked: stakedBalance / 1000000,
      };
    },
    {
      onSuccess: data => {
        return data;
      },
      onError: error => {
        console.error(error);
      },
      enabled,
      refetchInterval,
    },
  );
}

export function formatBalance(value: number): string {
  if (value === 0) {
    return '0.0';
  }

  const suffixes = ['', 'k', 'm', 'b', 't'];
  const base = Math.floor(Math.log10(Math.abs(value)) / 3);
  //TODO: base sometimes is -1 when we have value < 1
  const suffix = suffixes[base > 0 ? base : 0];
  const scaledValue = value / Math.pow(10, base * 3);
  const formattedValue = scaledValue.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return `${formattedValue}${suffix}`;
}
