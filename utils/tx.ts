import { IndexedTx } from '@cosmjs/stargate';

export const getAttribute = (
  result: IndexedTx,
  event: string,
  attribute: string,
) => {
  try {
    return result.events
      ?.find(e => e.type === event)
      ?.attributes.find(e => e.key === attribute)?.value;
  } catch (e) {
    console.error('error', e);
  }
};
