/**
 * Converts an Excel serial number date to a JavaScript Date object.
 * Excel stores dates as the number of days since 1900-01-01.
 * @param serial The Excel serial number for the date.
 * @returns A JavaScript Date object.
 */
function excelSerialToDate(serial: number): Date {
  // 25569 is the number of days from 1900-01-01 to 1970-01-01 (UTC epoch)
  const utc_days = serial - 25569;
  const utc_value = utc_days * 86400; // 86400 seconds in a day
  const date_info = new Date(utc_value * 1000);

  // Adjust for timezone offset
  const fractional_day = serial - Math.floor(serial) + 0.0000001;
  let total_seconds = Math.floor(86400 * fractional_day);
  const seconds = total_seconds % 60;
  total_seconds -= seconds;
  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;
  
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}


/**
 * Parses a date value from the spreadsheet which could be a string, number, or Date.
 * @param dateValue The date value from the sheet.
 * @returns A JavaScript Date object or null if invalid.
 */
function parseDate(dateValue: any): Date | null {
  if (!dateValue) {
    return null;
  }

  let date: Date;

  if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === 'number' && dateValue > 0) {
    date = excelSerialToDate(dateValue);
  } else if (typeof dateValue === 'string') {
    const parsedDate = new Date(dateValue);
    if (!isNaN(parsedDate.getTime())) {
      date = parsedDate;
    } else {
      return null;
    }
  } else {
    return null;
  }

  // Check for invalid date one last time
  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}

/**
 * Formats a date value from the spreadsheet into a human-readable string.
 * @param dateValue The date value from the sheet.
 * @returns A formatted date string (e.g., "Jan 1, 2024") or "N/A" if invalid.
 */
export const formatDate = (dateValue: any): string => {
  const date = parseDate(dateValue);
  if (!date) {
    return 'N/A';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Formats a date value from the spreadsheet into an ISO 8601 string (YYYY-MM-DD).
 * This is useful for machine-readable formats like JSON-LD schema.
 * @param dateValue The date value from the sheet.
 * @returns A formatted ISO date string or undefined if invalid.
 */
export const formatDateISO = (dateValue: any): string | undefined => {
    const date = parseDate(dateValue);
    if (!date) {
      return undefined;
    }
    
    return date.toISOString().split('T')[0];
};