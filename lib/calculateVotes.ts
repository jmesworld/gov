export const calculateVotes = ({
  coin_Yes,
  coin_no,
  totalSupply,
}: {
  coin_Yes?: string;
  coin_no?: string;
  totalSupply: number;
}) => {
  const coinYes = Number(coin_Yes) || 0;
  const coinNo = Number(coin_no) || 0;

  const threshold = totalSupply * 0.1 + (coinYes - coinNo);
  const thresholdPercent = (threshold / totalSupply) * 100;
  const yesPercentage = (totalSupply > 0 ? coinYes / totalSupply : 0) * 100;
  const noPercentage = (totalSupply > 0 ? coinNo / totalSupply : 0) * 100;

  return {
    coinYes,
    coinNo,
    threshold,
    thresholdPercent,
    yesPercentage,
    noPercentage,
  };
};
