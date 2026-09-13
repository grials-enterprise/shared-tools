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
