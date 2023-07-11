import { Dispatch, SetStateAction } from 'react';
import { chainName, chainId, rest_keplr, rpc_keplr } from '../config/defaults';

export const checkForKeplrInstalled = async () => {
    if (typeof window !== 'undefined' && !window.keplr) {
        return false;
    } else {
        return true;
    }
};

export const addJMEStoKeplr = async () => {
    // @ts-ignore
    return await window.keplr.experimentalSuggestChain({
        rpc: rpc_keplr,
        rest: rest_keplr,
        chainId: chainId,
        chainName: chainName,
        stakeCurrency: {
            coinDenom: 'JMES',
            coinMinimalDenom: 'ujmese',
            coinDecimals: 6,
        },
        bech32Config: {
            bech32PrefixAccAddr: 'jmes',
            bech32PrefixAccPub: 'jmespub',
            bech32PrefixValAddr: 'jmesvaloper',
            bech32PrefixValPub: 'jmesvaloperpub',
            bech32PrefixConsAddr: 'jmesvalcons',
            bech32PrefixConsPub: 'jmesvalconspub',
        },
        bip44: {
            coinType: 6280,
        },
        currencies: [
            {
                coinDenom: 'JMES',
                coinMinimalDenom: 'ujmes',
                coinDecimals: 6,
            },
        ],
        feeCurrencies: [
            {
                coinDenom: 'JMES',
                coinMinimalDenom: 'ujmes',
                coinDecimals: 6,
            },
        ],
        gasPriceStep: {
            low: 0.1,
            average: 0.2,
            high: 0.4,
        },
        features: ['stargate', 'no-legacy-stdTx', 'ibc-transfer'],
    });
};

export const checkJMESInKeplr = async () => {
    let key: any = undefined;
    try {
        key = await window.keplr.getKey(chainId);
        if (key) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
    return !!key;
};

export const connectKeplrWallet = async (walletRepo: any) => {
    const keplrWalletExtension = walletRepo.wallets[0];
    await keplrWalletExtension?.connect();
};
