import { typeCheck } from 'type-check';

export const newValueInstance = (data: object) => {
  return JSON.parse(JSON.stringify(data));
};

export const newIntrinsicInstance = (data: any) => {
  let newValue = data;
  if (typeCheck('String', data)) {
    return String(data);
  }

  if (typeCheck('Number', data)) {
    return Number(data);
  }

  if (typeCheck('Boolean', data)) {
    return Boolean(data);
  }

  if (typeCheck('Date', data)) {
    const year = data.getFullYear();
    const month = data.getMonth();
    const day = data.getDate();
    const hours = data.getHours();
    const minutes = data.getMinutes();
    const seconds = data.getSeconds();
    const milliseconds = data.getMilliseconds();
    return new Date(year, month, day, hours, minutes, seconds, milliseconds);
  }

  if (typeCheck('Undefined', data)) {
    return null;
  }

  if (typeCheck('Null', data)) {
    return null;
  }

  if (
    typeCheck('Object', data) &&
    (data.constructor?.name === 'Object' ||
      (data.constructor?.name !== 'Array' &&
        data.constructor?.name !== 'Date' &&
        data.constructor?.name !== 'String' &&
        data.constructor?.name !== 'Number' &&
        data.constructor?.name !== 'Boolean' &&
        data.constructor?.name !== 'Function' &&
        data.constructor?.name !== 'RegExp' &&
        data.constructor?.name !== 'Error' &&
        data.constructor?.name !== 'Symbol' &&
        data.constructor?.name !== 'BigInt' &&
        data.constructor?.name !== 'WeakMap' &&
        data.constructor?.name !== 'WeakSet' &&
        data.constructor?.name !== 'Map' &&
        data.constructor?.name !== 'Set' &&
        data.constructor?.name !== 'ArrayBuffer' &&
        data.constructor?.name !== 'DataView' &&
        data.constructor?.name !== 'Promise' &&
        data.constructor?.name !== 'Generator' &&
        data.constructor?.name !== 'GeneratorFunction' &&
        data.constructor?.name !== 'AsyncFunction' &&
        data.constructor?.name !== 'ObjectId' &&
        data.constructor?.name !== 'AsyncGenerator' &&
        data.constructor?.name !== 'AsyncGeneratorFunction'))
  ) {
    newValue = { ...data };
    for (const key of Object.keys(newValue)) {
      newValue[key] = newIntrinsicInstance(newValue[key]);
    }
    return newValue;
  }

  if (typeCheck('Array', data)) {
    newValue = [...data];

    for (let i = 0; i < newValue.length; i++) {
      newValue[i] = newIntrinsicInstance(newValue[i]);
    }
    return newValue;
  }

  return newValue;
};
