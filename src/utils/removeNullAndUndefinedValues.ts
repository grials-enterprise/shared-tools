import { typeCheck } from 'type-check';
import { validateObjectValues } from './validateObjectValues';
import { validateArrayValues } from './validateArrayValues';

export const removeNullAndUndefinedValues = (data: any) => {
  if (typeCheck('Object', data)) {
    return validateObjectValues({ ...data });
  }

  if (typeCheck('Array', data)) {
    return validateArrayValues([...data]);
  }

  return data;
};
