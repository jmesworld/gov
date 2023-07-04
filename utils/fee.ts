import { StdFee } from '@cosmjs/amino';

export const fee: StdFee = {
  amount: [{ amount: '30000', denom: 'ujmes' }],
  gas: '10000000',
};
