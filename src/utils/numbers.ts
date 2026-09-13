export const getNumberOfDecimals = (number: number, decimals: number): number => {
  if (!Number.isFinite(number)) {
    throw new Error('Input must be a finite number');
  }

  const factor = Math.pow(10, decimals);
  return Math.trunc(number * factor) / factor;
};
