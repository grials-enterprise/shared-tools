/**
 * Converts a value to a number when it is numeric, otherwise returns its string
 * representation.
 *
 * Numeric values may include digits, dots and commas; the first comma is
 * replaced by a dot before converting to a number.
 *
 * @param value - Value to format.
 * @returns A number for numeric values, the string representation otherwise, or
 *   `undefined` for `undefined`, `null` and empty string.
 *
 * @category String & Formatting
 */
export const formatValueToStringOrNumber = (value: any) => {
  const regexNumber = /^[0-9\.,]+$/;
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const newValue = value.toString();
  if (regexNumber.test(newValue)) {
    return Number(newValue.replace(',', '.'));
  }
  return newValue;
};
