import { useQuery } from '@tanstack/react-query';
import { JMES_DENOM, BJMES_DENOM } from '../lib/constants';
import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';
import { Core } from 'jmes';

export function useAccountBalance(
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
        jmes: jmes ? new Core.Coin(jmes.denom, jmes.amount) : undefined,
        bJmes: bJmes ? new Core.Coin(bJmes.denom, bJmes.amount) : undefined,
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

export function formatBalance(balance: number) {
  const coin = new Core.Coin(JMES_DENOM, balance);
  return formatWithSuffix(coin.amount.absoluteValue().toNumber(), 1);
}

const formatWithSuffix = (value: number, decimalPlaces = 1) => {
  if (value === 0) {
    return '0.0';
  }

  const suffixes = ['', 'k', 'm', 'b', 't'];

  const base = Math.floor(Math.log10(Math.abs(value)) / 3);
  const suffix = suffixes[base > 0 ? base : 0];
  const scaledValue = value / Math.pow(10, base * 3);

  const formattedValue = scaledValue.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPlaces,
  });

  return `${formattedValue}${suffix}`;
};
