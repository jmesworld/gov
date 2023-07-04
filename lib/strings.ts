export const capitalizeFirstLetter = (text: string | undefined): string =>
  text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : '';
