export const formatDateTimeUS = (date: Date | string | number): string => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',    // Dec
    day: 'numeric',    // 2
    year: 'numeric',   // 2025
    hour: 'numeric',   // 3
    minute: '2-digit', // 45
    second: '2-digit', // 27
    hour12: true,      
  });
};

export const toYYYYMMDD = (input: string | Date): string => {
  let date: Date;
  if (input instanceof Date) {
    date = input;
  } else if (typeof input === 'string') {
    const parsed = new Date(input);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Cannot parse date from string: "${input}"`);
    }

    date = parsed;
  } else {
    throw new Error('Input must be a string or Date object');
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}