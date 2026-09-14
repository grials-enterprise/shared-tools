/**
 * Parses a value as a number, returning a default value when the value is not
 * a valid number.
 *
 * @param value - Value to parse.
 * @param defaultValue - Value returned when parsing fails.
 * @returns The parsed number or `defaultValue`.
 *
 * @category Number
 */
export const parseNumber = (value: unknown, defaultValue: any): number => {
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};
