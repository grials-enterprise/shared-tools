/**
 * Applies a format mask to a value, inserting the mask's literal characters
 * (any character other than `0`) into the value at their position.
 *
 * @example
 * ```ts
 * applyStringMask('000000000-0', '123456789'); // '12345678-9'
 * applyStringMask('00/00/0000', '01012025'); // '01/01/2025'
 * ```
 *
 * @param mask - Format mask. `0` keeps the position for a value character, any
 *   other character is inserted literally.
 * @param valueToChange - Value to format (alphanumeric characters only). Defaults to `''`.
 * @returns The masked value.
 *
 * @category String & Formatting
 */
export const applyStringMask = (mask: string, valueToChange: string = '') => {
  const value = valueToChange
    ? valueToChange
        .replace(/[^A-Z0-9]/gi, '')
        .split('')
        .reverse()
    : [];
  if (mask) {
    const newMask = mask.split('').reverse();
    for (let index = 0; index < value.length; index++) {
      const chartCodeMask = newMask[index].codePointAt(0);
      if (chartCodeMask === 48) {
        continue;
      }

      value.splice(index, 0, newMask[index]);
      index = index + 2;

      if (index >= newMask.length - 1) {
        break;
      }
    }
  }

  return value.reverse().join('');
};
