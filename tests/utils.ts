export const toCamelCase = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/_([a-z])/g, (match, captureGroup, position, stringBase) => captureGroup.toUpperCase());
};
