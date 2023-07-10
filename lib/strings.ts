export const capitalizeFirstLetter = (text: string | undefined): string =>
  text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : '';

export const formatString = (text: string): string => {
  // replace _ to space
  // make first letter capital

  return text
    .replace(/_/g, ' ')
    .split(' ')
    .map(capitalizeFirstLetter)
    .join(' ');
};
