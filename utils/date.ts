/**
 * Parses a date value from the spreadsheet which could be a string in various formats 
 * (DD/MM/YYYY, YYYY-MM-DD, Excel serial) or a Date object.
 * It's designed to be robust against various formats encountered from CSV exports.
 * @param dateValue The date value from the sheet.
 * @returns A JavaScript Date object in UTC or null if invalid.
 */
function parseDate(dateValue: any): Date | null {
  if (dateValue === null || dateValue === undefined || String(dateValue).trim() === '') {
    return null;
  }

  // If it's already a valid Date object, return it.
  if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
    return dateValue;
  }

  const valueAsString = String(dateValue).trim();

  // Priority 1: Handle DD/MM/YYYY format, common in the source sheet.
  const dmyMatch = valueAsString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = parseInt(dmyMatch[3], 10);
    // Month is 0-indexed in JavaScript's Date constructor.
    // We use Date.UTC to prevent local timezone from shifting the date.
    const date = new Date(Date.UTC(year, month - 1, day));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Priority 2: Attempt to parse as an Excel serial date number.
  // These are often read as strings from a CSV.
  if (/^\d+(\.\d+)?$/.test(valueAsString)) {
    const serial = parseFloat(valueAsString);
    // A value > 10000 corresponds to a date after 1927, a safe threshold.
    if (serial > 10000) {
      // Excel's epoch starts on 1899-12-30 due to a leap year bug.
      const date = new Date(Date.UTC(1899, 11, 30 + serial));
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  // Priority 3: Fallback to standard JavaScript Date parsing for other common 
  // string formats like 'YYYY-MM-DD', 'MM/DD/YYYY', or ISO strings.
  const parsedDate = new Date(valueAsString);
  if (!isNaN(parsedDate.getTime())) {
    // Even if JS parses it successfully, we convert it to a UTC date to ensure consistency
    // across the app and avoid timezone-related off-by-one-day errors.
    // new Date() parses based on local time. We extract components and rebuild in UTC.
    return new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
  }

  return null;
}


/**
 * Formats a date value from the spreadsheet into a human-readable string (e.g., "Jan 1, 2024").
 * @param dateValue The date value from the sheet.
 * @returns A formatted date string or "N/A" if invalid.
 */
export const formatDate = (dateValue: any): string => {
  const date = parseDate(dateValue);
  if (!date) {
    return 'N/A';
  }

  // By parsing to UTC and formatting in UTC, we ensure the date displayed is the one from the sheet,
  // regardless of the user's local timezone.
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
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
    
    // toISOString always returns a UTC-formatted string (e.g., "2024-12-25T00:00:00.000Z"),
    // so we just take the date part.
    return date.toISOString().split('T')[0];
};