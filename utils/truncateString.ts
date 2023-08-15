export const truncateFromMiddle = (
  fullStr: string | undefined,
  strLen: number,
  middleStr = '...',
) => {
  if (!fullStr) {
    return '';
  }
  if (fullStr.length <= strLen) return fullStr;
  const midLen = middleStr.length;
  const charsToShow = strLen - midLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.slice(0, frontChars) +
    middleStr +
    fullStr.slice(fullStr.length - backChars)
  );
};
