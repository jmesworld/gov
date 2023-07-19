import { formatString } from '../lib/strings';

export const getFormattedSlotType = (slotType?: string): string => {
  if (!slotType) return '';
  let type = slotType;
  if (slotType === 'core_tech') {
    type = 'tech';
  }
  return formatString(type);
};
