/**
 * Checks that every character of a value is present in the accepted character set.
 *
 * @param value - String to validate.
 * @param acceptedCharacters - String containing every allowed character.
 * @returns `true` if all characters are accepted, `false` otherwise.
 * @throws {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} if `value` or `acceptedCharacters` are not strings.
 *
 * @category String & Formatting
 */
export const validateStringChartAccepted = (value: string, acceptedCharacters: string) => {
  if (typeof value !== 'string') {
    throw new Error('the value must be a string');
  }

  if (typeof acceptedCharacters !== 'string') {
    throw new Error('the acceptedCharacters must be a string');
  }

  const valueToTest = value.split('');

  for (const chart of valueToTest) {
    if (!acceptedCharacters.includes(chart)) {
      return false;
    }
  }

  return true;
};
