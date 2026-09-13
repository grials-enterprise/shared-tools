import assert from 'assert';
import { TEST_EXECUTE } from '../setup';
import {
  applyStringMask,
  createExamOrderNumber,
  executeBasicFunctionString,
  formatValueToStringOrNumber,
  getNumberOfDecimals,
  parseNumber,
  validateStringChartAccepted,
} from '../../src/utils';

describe('utils - format & parse', function () {
  if (!(TEST_EXECUTE === 'ALL' || TEST_EXECUTE === '4')) {
    return;
  }

  it('success, formatValueToStringOrNumber', () => {
    assert.strictEqual(formatValueToStringOrNumber(undefined), undefined);
    assert.strictEqual(formatValueToStringOrNumber(null), undefined);
    assert.strictEqual(formatValueToStringOrNumber(''), undefined);

    assert.strictEqual(formatValueToStringOrNumber('123'), 123);
    assert.strictEqual(formatValueToStringOrNumber('12,5'), 12.5);
    assert.strictEqual(formatValueToStringOrNumber('12.5'), 12.5);
    assert.strictEqual(formatValueToStringOrNumber('abc'), 'abc');
    assert.strictEqual(formatValueToStringOrNumber(99), 99);
  });

  it('success, parseNumber', () => {
    assert.strictEqual(parseNumber('123', 0), 123);
    assert.strictEqual(parseNumber(45.6, 0), 45.6);
    assert.strictEqual(parseNumber('abc', 0), 0);
    assert.strictEqual(parseNumber(undefined, 7), 7);
    assert.strictEqual(parseNumber(NaN, -1), -1);
  });

  it('success, getNumberOfDecimals', () => {
    assert.strictEqual(getNumberOfDecimals(3.14159, 2), 3.14);
    assert.strictEqual(getNumberOfDecimals(3.14159, 0), 3);
    assert.strictEqual(getNumberOfDecimals(10, 3), 10);
    assert.strictEqual(getNumberOfDecimals(-1.999, 2), -1.99);
  });

  it('error, getNumberOfDecimals - non finite', () => {
    assert.throws(() => getNumberOfDecimals(Infinity, 2), /finite number/);
    assert.throws(() => getNumberOfDecimals(NaN, 2), /finite number/);
    assert.throws(() => getNumberOfDecimals(-Infinity, 2), /finite number/);
  });

  it('success, applyStringMask - empty value', () => {
    assert.strictEqual(applyStringMask('000-000', ''), '');
    assert.strictEqual(applyStringMask('000-000'), '');
  });

  it('success, applyStringMask - empty mask', () => {
    assert.strictEqual(applyStringMask('', '123'), '123');
  });

  it('success, applyStringMask - mask with digits and separator', () => {
    assert.strictEqual(applyStringMask('000000000-0', '123456789'), '12345678-9');
    assert.strictEqual(applyStringMask('00/00/0000', '01012025'), '01/01/2025');
  });

  it('success, applyStringMask - long value with mask', () => {
    assert.strictEqual(applyStringMask('00-00', '123456'), '1234-56');
  });

  it('success, executeBasicFunctionString', () => {
    const func = 'return value.length === 10 ? true : "The identifier is not valid";';
    assert.strictEqual(executeBasicFunctionString('1234567890', func, 'value'), true);
    assert.strictEqual(executeBasicFunctionString('123', func, 'value'), 'The identifier is not valid');
  });

  it('error, executeBasicFunctionString - invalid arguments', () => {
    assert.throws(() => executeBasicFunctionString('x', 123 as any, 'value'), /funcString must be a string/);
    assert.throws(() => executeBasicFunctionString('x', 'return value;', 123 as any), /arg must be a string/);
  });

  it('error, executeBasicFunctionString - function throws', () => {
    assert.throws(() => executeBasicFunctionString('x', 'throw new Error("boom");', 'value'), /boom/);
  });

  it('success, validateStringChartAccepted', () => {
    assert.strictEqual(validateStringChartAccepted('123456789', '0123456789'), true);
    assert.strictEqual(validateStringChartAccepted('1234567890A', '0123456789'), false);
    assert.strictEqual(validateStringChartAccepted('', '0123'), true);
  });

  it('error, validateStringChartAccepted - invalid arguments', () => {
    assert.throws(() => validateStringChartAccepted(123 as any, '0123'), /value must be a string/);
    assert.throws(() => validateStringChartAccepted('123', 123 as any), /acceptedCharacters must be a string/);
  });

  it('success, createExamOrderNumber', () => {
    const orderNumber = createExamOrderNumber();
    const regex = /^[0-9]{18}$/;
    assert.ok(regex.test(orderNumber), `Order number format is incorrect ${orderNumber}`);
    assert.strictEqual(orderNumber.length, 18);
  });
});
