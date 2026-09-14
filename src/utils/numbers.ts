/**
 * Truncates a number to a given number of decimal places.
 *
 * @param number - Number to truncate.
 * @param decimals - Number of decimal places to keep.
 * @returns The truncated number.
 * @throws {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} if `number` is not finite.
 *
 * @category Number
 */
export const getNumberOfDecimals = (number: number, decimals: number): number => {
  if (!Number.isFinite(number)) {
    throw new Error('Input must be a finite number');
  }

  const factor = Math.pow(10, decimals);
  return Math.trunc(number * factor) / factor;
};
