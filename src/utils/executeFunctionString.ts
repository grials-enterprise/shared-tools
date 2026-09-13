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
