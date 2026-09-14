/**
 * Executes a function passed as a string, binding the given argument name to
 * the provided value.
 *
 * @example
 * ```ts
 * executeBasicFunctionString('1234567890', 'return value.length === 10;', 'value'); // true
 * ```
 *
 * @param value - Value to pass as the bound argument.
 * @param funcString - Function body as a string.
 * @param arg - Name of the parameter that receives `value`.
 * @returns The value returned by the executed function.
 * @throws {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error | Error} if `funcString` or `arg` are not strings, or if the function body throws.
 *
 * @category String & Formatting
 */
export const executeBasicFunctionString = (value: any, funcString: string, arg: string) => {
  if (typeof funcString !== 'string') {
    throw new Error('the funcString must be a string');
  }
  if (typeof arg !== 'string') {
    throw new Error('the arg must be a string');
  }

  try {
    const validationFunction = new Function(...[arg, funcString]);

    return validationFunction(value);
  } catch (error) {
    throw error;
  }
};
