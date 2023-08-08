import moment from 'moment';

export const momentLeft = (timestamp: any) => {
  return (
    moment(new Date(timestamp * 1000), 'YYYY-MM-DD').fromNow(true) + ' left'
  );
};

export const timestampToDateTime = (timestamp: number) => {
  const formatDateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  const formatTimeOptions: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  const date = new Date(timestamp).toLocaleDateString('us', formatDateOptions);
  const time = new Date(timestamp).toLocaleTimeString('us', formatTimeOptions);
  return `${date.toUpperCase()} ${time}  `;
};

export const formatDuration = (durationInSeconds: number) => {
  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const year = 365 * day;

  if (durationInSeconds < minute) {
    return `${durationInSeconds} second${durationInSeconds !== 1 ? 's' : ''}`;
  } else if (durationInSeconds < hour) {
    const minutes = Math.floor(durationInSeconds / minute);
    const seconds = durationInSeconds % minute;
    if (seconds === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${
        minutes !== 1 ? 's' : ''
      } and ${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
  } else if (durationInSeconds < day) {
    const hours = Math.floor(durationInSeconds / hour);
    const minutes = Math.floor((durationInSeconds % hour) / minute);
    return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${
      minutes !== 1 ? 's' : ''
    }`;
  } else if (durationInSeconds < year) {
    const days = Math.floor(durationInSeconds / day);
    const hours = Math.floor((durationInSeconds % day) / hour);
    return `${days} day${days !== 1 ? 's' : ''} and ${hours} hour${
      hours !== 1 ? 's' : ''
    }`;
  } else {
    const years = Math.floor(durationInSeconds / year);
    const days = Math.floor((durationInSeconds % year) / day);
    return `${years} year${years !== 1 ? 's' : ''} and ${days} day${
      days !== 1 ? 's' : ''
    }`;
  }
};
