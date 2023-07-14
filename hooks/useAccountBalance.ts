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

export function formatBalance(balance?: number, decimalPlaces = 2) {
  if (!balance) {
    return '0';
  }
  const coin = new Core.Coin(JMES_DENOM, balance);
  return formatWithSuffix(
    coin.amount.absoluteValue().toNumber(),
    decimalPlaces,
  );
}

const formatWithSuffix = (value: number, decimalPlaces = 2) => {
  if (value === 0) {
    return decimalPlaces <= 1 ? '0' : '0.0';
  }

  const suffixes = ['', 'k', 'm', 'b', 't'];

  const base = Math.floor(Math.log10(Math.abs(value)) / 3);
  if (base < 0) return value.toFixed(decimalPlaces);
  const suffix = suffixes[base > 0 ? base : 0];
  if (!suffix) return value;
  const scaledValue = value / 1e3;
  const formattedValue =
    Math.floor(scaledValue * 10 ** decimalPlaces) / 10 ** decimalPlaces;

  return `${formattedValue}${suffix}`;
};

export function formatBalanceWithComma(balance: number, decimalPlaces = 2) {
  const coin = new Core.Coin(JMES_DENOM, balance);
  return (
    coin.amount.toDecimalPlaces(decimalPlaces).toNumber().toLocaleString() ??
    '0'
  );
}
