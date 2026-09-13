import assert from 'assert';
import { TEST_EXECUTE } from '../setup';
import { identifierTypeEcuadorMock } from '../mocks/identifierType.mock';
import {
  applyStringMask,
  validateArrayValues,
  validateObjectValues,
  removeNullAndUndefinedValues,
  getAllJsonKeyAndValues,
  validateIdentifierInput,
} from '../../src/utils';

describe('utils - validate values', function () {
  if (!(TEST_EXECUTE === 'ALL' || TEST_EXECUTE === '6')) {
    return;
  }

  it('success, validateArrayValues - skips null/undefined/empty string', () => {
    const result = validateArrayValues([1, null, undefined, '', 'x', true, 0]);
    assert.deepStrictEqual(result, [1, 'x', true, 0]);
  });

  it('success, validateArrayValues - nested objects and arrays', () => {
    const input = [
      1,
      { a: 1, b: null },
      {},
      [1, null, 2],
      '  keep spaces  ',
      null,
    ];
    const result = validateArrayValues(input);
    assert.deepStrictEqual(result, [1, { a: 1 }, [1, 2], '  keep spaces  ']);
  });

  it('success, validateArrayValues - empty array', () => {
    assert.deepStrictEqual(validateArrayValues([]), []);
  });

  it('success, validateObjectValues - removes null/undefined/empty and trims', () => {
    const result = validateObjectValues({
      a: null,
      b: undefined,
      c: '',
      d: '  hi  ',
      e: 5,
      f: false,
    });
    assert.deepStrictEqual(result, { d: 'hi', e: 5, f: false });
  });

  it('success, validateObjectValues - nested objects and arrays', () => {
    const result = validateObjectValues({
      a: { b: 1, c: null },
      d: {},
      e: { f: null },
      g: [1, null, 'x'],
      h: '  spaced  ',
    });
    assert.deepStrictEqual(result, {
      a: { b: 1 },
      g: [1, 'x'],
      h: 'spaced',
    });
  });

  it('success, validateObjectValues - empty object', () => {
    assert.deepStrictEqual(validateObjectValues({}), {});
  });

  it('success, removeNullAndUndefinedValues - object', () => {
    assert.deepStrictEqual(removeNullAndUndefinedValues({ a: 1, b: null }), { a: 1 });
  });

  it('success, removeNullAndUndefinedValues - array', () => {
    assert.deepStrictEqual(removeNullAndUndefinedValues([1, null, 'x']), [1, 'x']);
  });

  it('success, removeNullAndUndefinedValues - primitives passthrough', () => {
    assert.strictEqual(removeNullAndUndefinedValues('str'), 'str');
    assert.strictEqual(removeNullAndUndefinedValues(42), 42);
    assert.strictEqual(removeNullAndUndefinedValues(null), null);
  });

  it('success, getAllJsonKeyAndValues - primitives', () => {
    assert.deepStrictEqual(getAllJsonKeyAndValues({ a: 1, b: 'x', c: true, d: null }), [
      { key: 'a', value: 1 },
      { key: 'b', value: 'x' },
      { key: 'c', value: true },
      { key: 'd', value: null },
    ]);
  });

  it('success, getAllJsonKeyAndValues - nested object', () => {
    assert.deepStrictEqual(getAllJsonKeyAndValues({ a: { b: 2 } }), [{ key: 'a.b', value: 2 }]);
    assert.deepStrictEqual(getAllJsonKeyAndValues({ a: { b: { c: 3 } } }), [{ key: 'a.b.c', value: 3 }]);
  });

  it('success, getAllJsonKeyAndValues - empty array', () => {
    assert.deepStrictEqual(getAllJsonKeyAndValues({ a: [] }), [{ key: 'a', value: '__EMPTY__' }]);
    assert.deepStrictEqual(getAllJsonKeyAndValues({ a: 1, b: [] }), [
      { key: 'a', value: 1 },
      { key: 'b', value: '__EMPTY__' },
    ]);
  });

  it('success, getAllJsonKeyAndValues - array traversal', () => {
    assert.deepStrictEqual(getAllJsonKeyAndValues({ a: [1, 2] }), [
      { key: 'a.0', value: 1 },
      { key: 'a.1', value: 2 },
    ]);
    assert.deepStrictEqual(getAllJsonKeyAndValues({ a: [{ b: 1 }, { b: 2 }] }), [
      { key: 'a.0.b', value: 1 },
      { key: 'a.1.b', value: 2 },
    ]);
  });

  it('success, getAllJsonKeyAndValues - non object returns empty', () => {
    assert.deepStrictEqual(getAllJsonKeyAndValues(null), []);
    assert.deepStrictEqual(getAllJsonKeyAndValues(undefined), []);
    assert.deepStrictEqual(getAllJsonKeyAndValues('str'), []);
    assert.deepStrictEqual(getAllJsonKeyAndValues([1, 2]), []);
    assert.deepStrictEqual(getAllJsonKeyAndValues(42), []);
  });

  it('error, getAllJsonKeyAndValues - invalid data type', () => {
    assert.throws(() => getAllJsonKeyAndValues({ a: new Date() }), /Invalid data type object in a/);
    assert.throws(() => getAllJsonKeyAndValues({ a: undefined }), /Invalid data type undefined in a/);
    assert.throws(() => getAllJsonKeyAndValues({ a: () => 1 }), /Invalid data type function in a/);
  });

  it('success, validateIdentifierInput - valid identifier', () => {
    const result = validateIdentifierInput(
      applyStringMask(identifierTypeEcuadorMock.format, '1802722296'),
      identifierTypeEcuadorMock
    );
    assert.strictEqual(result, null);
  });

  it('success, validateIdentifierInput - boolean false result', () => {
    const result = validateIdentifierInput(
      applyStringMask(identifierTypeEcuadorMock.format, '1802722297'),
      identifierTypeEcuadorMock
    );
    assert.strictEqual(result, 'The identifier is not valid');
  });

  it('success, validateIdentifierInput - string error with default language', () => {
    const result = validateIdentifierInput('18027222', identifierTypeEcuadorMock);
    assert.strictEqual(result, 'Invalid rut identifier');
  });

  it('success, validateIdentifierInput - string error with spanish language', () => {
    const result = validateIdentifierInput('18027222', identifierTypeEcuadorMock, 'es');
    assert.strictEqual(result, 'Número de rut inválido');
  });

  it('success, validateIdentifierInput - string error E2', () => {
    const result = validateIdentifierInput('18027222-xx', identifierTypeEcuadorMock);
    assert.strictEqual(result, 'Verified number invalid');
  });

  it('success, validateIdentifierInput - error code not found returns default', () => {
    const customType = {
      validations: [
        {
          _function: 'return "E9";',
          properties: ['identifier'],
          errors: [{ text: 'E1', displays: [{ language: 'en', value: 'Some error' }] }],
        },
      ],
    };
    const result = validateIdentifierInput('anything', customType as any);
    assert.strictEqual(result, 'The identifier is not valid');
  });

  it('success, validateIdentifierInput - error without displays', () => {
    const customType = {
      validations: [
        {
          _function: 'return "E1";',
          properties: ['identifier'],
          errors: [{ text: 'E1' }],
        },
      ],
    };
    const result = validateIdentifierInput('anything', customType as any);
    assert.strictEqual(result, 'The identifier is not valid');
  });

  it('success, validateIdentifierInput - empty validations', () => {
    assert.strictEqual(validateIdentifierInput('anything', {}), null);
    assert.strictEqual(validateIdentifierInput('anything', { validations: [] }), null);
  });

  it('success, validateIdentifierInput - exception returns null', () => {
    const throwingType = {
      validations: [
        {
          _function: 'return identifier.nonExistent.value;',
          properties: ['identifier'],
        },
      ],
    };
    const result = validateIdentifierInput('abc', throwingType as any);
    assert.strictEqual(result, null);
  });

  it('success, validateIdentifierInput - empty function string', () => {
    const customType = {
      validations: [{ properties: ['identifier'] }],
    };
    const result = validateIdentifierInput('abc', customType as any);
    assert.strictEqual(result, 'The identifier is not valid');
  });

  it('success, validateIdentifierInput - empty properties', () => {
    const customType = {
      validations: [{ _function: 'return true;' }],
    };
    const result = validateIdentifierInput('abc', customType as any);
    assert.strictEqual(result, null);
  });

  it('success, validateIdentifierInput - errors undefined', () => {
    const customType = {
      validations: [{ _function: 'return "E1";', properties: ['identifier'] }],
    };
    const result = validateIdentifierInput('anything', customType as any);
    assert.strictEqual(result, 'The identifier is not valid');
  });

  it('success, validateIdentifierInput - null item in errors', () => {
    const customType = {
      validations: [
        {
          _function: 'return "E1";',
          properties: ['identifier'],
          errors: [null, { text: 'E1', displays: [{ language: 'en', value: 'X' }] }],
        },
      ],
    };
    const result = validateIdentifierInput('anything', customType as any);
    assert.strictEqual(result, 'X');
  });

  it('success, validateIdentifierInput - null item in displays', () => {
    const customType = {
      validations: [
        {
          _function: 'return "E1";',
          properties: ['identifier'],
          errors: [{ text: 'E1', displays: [null, { language: 'en', value: 'Y' }] }],
        },
      ],
    };
    const result = validateIdentifierInput('anything', customType as any);
    assert.strictEqual(result, 'Y');
  });
});
