import { useQuery } from '@tanstack/react-query';
import { JMES_DENOM, BJMES_DENOM } from '../lib/constants';
import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';

export function useAccountBalance<T extends boolean = false>(
  address: string | undefined,
  refetchInterval = 60 * 1000,
  enabled = true,
) {
  const { cosmWasmClient } = useCosmWasmClientContext();
  return useQuery(
    ['accountBalance', address],
    async ({ queryKey }) => {
      const address = queryKey[1] as string | undefined;
      if (!address) {
        throw new Error('No address passed');
      }
      const jmes = await cosmWasmClient?.getBalance(address, JMES_DENOM);
      const bJmes = await cosmWasmClient?.getBalance(address, BJMES_DENOM);

      return {
        jmes: Number(jmes?.amount ?? null) / 10e6 ?? 0,
        bJmes: Number(bJmes?.amount ?? null) / 10e6 ?? 0,
      };
    },
    {
      onSuccess: data => {
        return data;
      },
      onError: error => {
        console.error(error);
      },
      enabled: enabled && !!address && !!cosmWasmClient,
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
