import { typeCheck } from 'type-check';
import { validateObjectValues } from './validateObjectValues';

export const validateArrayValues = (data: any) => {
  const newData: any[] = [];
  for (const item of data) {
    if (typeCheck('Undefined', item) || typeCheck('Null', item) || (typeCheck('String', item) && !item)) {
      continue;
    }

    if (typeCheck('Object', item)) {
      const response = validateObjectValues(item);

      if (Object.keys(response).length) {
        newData.push(response);
      }
    } else if (typeCheck('Array', item)) {
      const response: any = validateArrayValues(item);
      newData.push(response);
    } else {
      newData.push(item);
    }
  }

  return newData;
};
