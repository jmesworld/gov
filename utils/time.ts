export const timestampToDaysLeft = (timestamp: any) => {
  const now = Date.now();
  const diff = timestamp * 1000 - now;

  const day_count = Math.ceil(diff / (1000 * 3600 * 24));
  return `${day_count} ${day_count === 1 ? "day" : "days"}`;
};

export const timestampToDateTime = (timestamp: number) => {
  const formatDateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const formatTimeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const epoch = timestamp * 1000;
  const date = new Date(epoch).toLocaleDateString("us", formatDateOptions);
  const time = new Date(epoch).toLocaleTimeString("us", formatTimeOptions);
  const period = parseInt(time.substring(0, 2)) >= 12 ? "PM" : "AM";
  return `${date.toUpperCase()} ${time} ${period}`;
};
