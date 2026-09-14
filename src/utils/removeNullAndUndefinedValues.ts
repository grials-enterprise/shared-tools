import { typeCheck } from 'type-check';
import { validateObjectValues } from './validateObjectValues';
import { validateArrayValues } from './validateArrayValues';

/**
 * Recursively removes `null`, `undefined` and empty-string values from an
 * object or array. Other values are returned unchanged.
 *
 * @param data - Object or array to clean.
 * @returns The cleaned object or array.
 *
 * @category Data & JSON
 */
export const removeNullAndUndefinedValues = (data: any) => {
  if (typeCheck('Object', data)) {
    return validateObjectValues({ ...data });
  }

  if (typeCheck('Array', data)) {
    return validateArrayValues([...data]);
  }

  return data;
};
