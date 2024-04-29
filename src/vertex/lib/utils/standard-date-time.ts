import { parse } from "date-fns"

/**
 * Parses the provided date string using the specified date format and returns a standardized date object.
 * @param {string} date - The date string to parse.
 * @param {string} dateFormat - The format of the date string you passing to this function (e.g., 'yyyy-MM-dd').
 * @returns {Date} A Date object representing the parsed date.
 * 
 * @example 
const dateString = '2024-05-01';
const dateFormat = 'yyyy-MM-dd';
const standardizedDate = standardDateTime(dateString, dateFormat);
console.log(standardizedDate); // Output: Sat May 01 2024 00:00:00 GMT+0530 (India Standard Time)
 */
export function standardDateTime(date: string, dateFormat: string): Date {
  return parse(date, dateFormat, new Date())
}
