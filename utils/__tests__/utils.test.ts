import { formatDateTimeUS, toYYYYMMDD } from '../utils';

describe('formatDateTimeUS', () => {
  it('should format a Date object to US locale string', () => {
    const date = new Date('2024-12-25T14:30:45.123Z');
    const result = formatDateTimeUS(date);
    
    expect(result).toMatch(/Dec/);
    expect(result).toMatch(/25/);
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/14|2/); // hour in 12 or 24 format
  });

  it('should format a date string to US locale string', () => {
    const dateString = '2024-03-15T09:15:30.000Z';
    const result = formatDateTimeUS(dateString);
    
    expect(result).toMatch(/Mar/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2024/);
  });

  it('should format a timestamp number to US locale string', () => {
    const timestamp = new Date('2024-06-10T18:45:00.000Z').getTime();
    const result = formatDateTimeUS(timestamp);
    
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/10/);
    expect(result).toMatch(/2024/);
  });

  it('should handle different months correctly', () => {
    const january = new Date('2024-01-15T12:00:00.000Z');
    const july = new Date('2024-07-20T12:00:00.000Z');
    
    expect(formatDateTimeUS(january)).toMatch(/Jan/);
    expect(formatDateTimeUS(july)).toMatch(/Jul/);
  });
});

describe('toYYYYMMDD', () => {
  it('should convert Date object to YYYY-MM-DD format', () => {
    // Use noon UTC to ensure consistent date regardless of timezone
    const date = new Date('2024-12-25T12:00:00.000Z');
    const result = toYYYYMMDD(date);
    
    expect(result).toBe('2024-12-25');
  });

  it('should convert date string to YYYY-MM-DD format', () => {
    // Use noon UTC to ensure consistent date regardless of timezone
    const dateString = '2024-03-15T12:00:00.000Z';
    const result = toYYYYMMDD(dateString);
    
    expect(result).toBe('2024-03-15');
  });

  it('should pad single digit months and days with zeros', () => {
    const date = new Date('2024-01-05T12:00:00.000Z');
    const result = toYYYYMMDD(date);
    
    expect(result).toBe('2024-01-05');
  });

  it('should handle year boundaries correctly', () => {
    // Use dates at noon UTC to avoid timezone conversion issues
    // This ensures the date stays the same regardless of local timezone
    const newYear = new Date('2024-01-01T12:00:00.000Z');
    const endYear = new Date('2024-12-31T12:00:00.000Z');
    
    expect(toYYYYMMDD(newYear)).toBe('2024-01-01');
    expect(toYYYYMMDD(endYear)).toBe('2024-12-31');
  });

  it('should throw error for invalid date string', () => {
    expect(() => {
      toYYYYMMDD('invalid-date-string');
    }).toThrow('Cannot parse date from string');
  });

  it('should throw error for non-string, non-Date input', () => {
    expect(() => {
      toYYYYMMDD(12345 as any);
    }).toThrow('Input must be a string or Date object');
  });

  it('should handle dates from different timezones correctly', () => {
    // Use noon UTC to ensure consistent date regardless of timezone
    const date = new Date('2024-06-15T12:00:00.000Z');
    const result = toYYYYMMDD(date);
    
    // Should extract date part correctly and match expected format
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result).toBe('2024-06-15');
  });
});
