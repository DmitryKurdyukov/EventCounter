/**
 * Formats a date to US locale string format.
 * 
 * Converts a Date object, date string, or timestamp to a human-readable
 * US locale format (e.g., "Dec 25, 2024, 2:30:45 PM").
 * 
 * @param date - Date object, ISO date string, or timestamp number
 * @returns Formatted date string in US locale format
 * @example
 * formatDateTimeUS(new Date('2024-12-25T14:30:45.123Z'))
 * // Returns: "Dec 25, 2024, 2:30:45 PM"
 */
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

/**
 * Converts a date to YYYY-MM-DD format string.
 * 
 * Takes a Date object or ISO date string and returns a formatted string
 * in YYYY-MM-DD format (e.g., "2024-12-25"). Months and days are zero-padded.
 * Uses local time to match the user's timezone.
 * 
 * @param input - Date object or ISO date string
 * @returns Date string in YYYY-MM-DD format
 * @throws {Error} If input is not a valid Date or string, or if string cannot be parsed
 * @example
 * toYYYYMMDD(new Date('2024-12-25T14:30:45.123Z'))
 * // Returns: "2024-12-25"
 * toYYYYMMDD('2024-01-05T12:00:00.000Z')
 * // Returns: "2024-01-05"
 */
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