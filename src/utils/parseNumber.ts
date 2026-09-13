export const parseNumber = (value: unknown, defaultValue: any): number => {
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};
