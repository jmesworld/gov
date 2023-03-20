import { chainName, chainId, rest, rpc } from "../config/defaults";
export const addJMEStoKeplr = async () => {
  // @ts-ignore
  return await window.keplr.experimentalSuggestChain({
    rpc: rpc,
    rest: rest,
    chainId: chainId,
    chainName: chainName,
    stakeCurrency: {
      coinDenom: "JMES",
      coinMinimalDenom: "ujmes",
      coinDecimals: 6,
    },
    bech32Config: {
      bech32PrefixAccAddr: "jmes",
      bech32PrefixAccPub: "jmespub",
      bech32PrefixValAddr: "jmesvaloper",
      bech32PrefixValPub: "jmesvaloperpub",
      bech32PrefixConsAddr: "jmesvalcons",
      bech32PrefixConsPub: "jmesvalconspub",
    },
    bip44: {
      coinType: 6280,
    },
    currencies: [
      {
        coinDenom: "JMES",
        coinMinimalDenom: "ujmes",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "JMES",
        coinMinimalDenom: "ujmes",
        coinDecimals: 6,
      },
    ],
    gasPriceStep: {
      low: 0.05,
      average: 0.125,
      high: 0.2,
    },
    features: ["stargate", "no-legacy-stdTx", "ibc-transfer"],
  });
};

export const checkJMESInKeplr = async () => {
  let key: any = undefined;
  try {
    // @ts-ignore
    key = await window.keplr.getKey(chainId);
  } catch (error) {
    console.log(error);
  }
  return !!key;
};

export const connectKeplrWallet = async (walletRepo: any) => {
  const keplrWalletExtension = walletRepo.wallets[0];
  await keplrWalletExtension?.connect();
};
