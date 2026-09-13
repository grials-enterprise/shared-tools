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
