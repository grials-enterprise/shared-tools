import { typeCheck } from 'type-check';
import { validateArrayValues } from './validateArrayValues';

export const validateObjectValues = (data: any) => {
  const newData = { ...data };
  for (const key of Object.keys(newData)) {
    if (
      typeCheck('Undefined', newData[key]) ||
      typeCheck('Null', newData[key]) ||
      (typeCheck('String', newData[key]) && !newData[key])
    ) {
      delete newData[key];
    }

    if (typeCheck('Object', newData[key])) {
      const response = validateObjectValues(newData[key]);
      if (Object.keys(response).length) {
        newData[key] = response;
      } else {
        delete newData[key];
      }
    }
    if (typeCheck('Array', newData[key])) {
      newData[key] = validateArrayValues(newData[key]);
    }

    if (typeCheck('String', newData[key])) {
      newData[key] = newData[key].trim();
    }
  }

  return newData;
};
