import { typeCheck } from 'type-check';

const findAllObjectKeyAndValue = (data: any, currentValues: any[], currentValueKey: string): any[] => {
  if (typeCheck('Number', data) || typeCheck('String', data) || typeCheck('Boolean', data) || typeCheck('Null', data)) {
    return currentValues.map((currentValue) =>
      currentValue.key === currentValueKey ? { key: currentValueKey, value: data } : { ...currentValue }
    );
  }

  if (typeCheck('Object', data)) {
    const lowLevelKeys = Object.keys(data);
    let newCurrentValues: any[] = currentValues.filter((currentValue) => currentValue.key !== currentValueKey);
    for (const lowLevelKey of lowLevelKeys) {
      newCurrentValues = findAllObjectKeyAndValue(
        data[lowLevelKey],
        [...newCurrentValues, { key: `${currentValueKey}.${lowLevelKey}`, value: null }],
        `${currentValueKey}.${lowLevelKey}`
      );
    }
    return newCurrentValues;
  }

  if (typeCheck('Array', data)) {
    if (!data.length) {
      return currentValues.map((currentValue) =>
        currentValue.key === currentValueKey ? { key: currentValueKey, value: '__EMPTY__' } : { ...currentValue }
      );
    }
    let index = 0;
    let newCurrentValues: any[] = currentValues.filter((currentValue) => currentValue.key !== currentValueKey);
    for (const arrayItem of data) {
      newCurrentValues = findAllObjectKeyAndValue(
        arrayItem,
        [...newCurrentValues, { key: `${currentValueKey}.${index}`, value: null }],
        `${currentValueKey}.${index}`
      );
      ++index;
    }

    return newCurrentValues;
  }

  throw new Error(`Invalid data type ${typeof data} in ${currentValueKey}`);
};

export const getAllJsonKeyAndValues = (data: any): any[] => {
  let response: any[] = [];
  if (!typeCheck('Object', data)) {
    return response;
  }

  const keys = Object.keys(data);

  for (const key of keys) {
    response = findAllObjectKeyAndValue(data[key], [...response, { key, value: null }], key);
  }

  return response;
};
