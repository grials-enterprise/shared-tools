import assert from 'assert';
import { TEST_EXECUTE } from '../setup';
import { newValueInstance, newIntrinsicInstance } from '../../src/utils/newValueInstance';

const createNamedClass = (name: string) => {
  const cls = class {};
  Object.defineProperty(cls, 'name', { value: name });
  return cls;
};

describe('utils - newValueInstance', function () {
  if (!(TEST_EXECUTE === 'ALL' || TEST_EXECUTE === '3')) {
    return;
  }

  it('success, newValueInstance clones via JSON', () => {
    const data = { a: 1, b: { c: 'x' }, d: [1, 2, 3] };
    const result = newValueInstance(data);
    assert.deepStrictEqual(result, data);
    assert.notStrictEqual(result, data);
    assert.notStrictEqual(result.b, data.b);
  });

  it('success, newIntrinsicInstance - String', () => {
    assert.strictEqual(newIntrinsicInstance('hello'), 'hello');
  });

  it('success, newIntrinsicInstance - Number', () => {
    assert.strictEqual(newIntrinsicInstance(42), 42);
    assert.strictEqual(newIntrinsicInstance(3.14), 3.14);
  });

  it('success, newIntrinsicInstance - Boolean', () => {
    assert.strictEqual(newIntrinsicInstance(true), true);
    assert.strictEqual(newIntrinsicInstance(false), false);
  });

  it('success, newIntrinsicInstance - Date', () => {
    const date = new Date(2025, 0, 15, 10, 30, 45, 123);
    const result = newIntrinsicInstance(date);
    assert.strictEqual(result instanceof Date, true);
    assert.notStrictEqual(result, date);
    assert.strictEqual(result.getTime(), date.getTime());
  });

  it('success, newIntrinsicInstance - Undefined and Null', () => {
    assert.strictEqual(newIntrinsicInstance(undefined), null);
    assert.strictEqual(newIntrinsicInstance(null), null);
  });

  it('success, newIntrinsicInstance - plain object deep clone', () => {
    const data = { a: 1, b: { c: 'x' }, d: [1, 2, { e: true }] };
    const result = newIntrinsicInstance(data);
    assert.deepStrictEqual(result, data);
    assert.notStrictEqual(result, data);
    assert.notStrictEqual(result.b, data.b);
    assert.notStrictEqual(result.d, data.d);
  });

  it('success, newIntrinsicInstance - object with null prototype', () => {
    const data = Object.create(null);
    data.a = 1;
    data.b = 'x';
    const result = newIntrinsicInstance(data);
    assert.strictEqual(result.a, 1);
    assert.strictEqual(result.b, 'x');
    assert.notStrictEqual(result, data);
  });

  it('success, newIntrinsicInstance - array deep clone', () => {
    const data = [1, 'two', { three: 3 }, [4, 5]];
    const result = newIntrinsicInstance(data);
    assert.deepStrictEqual(result, data);
    assert.notStrictEqual(result, data);
    assert.notStrictEqual(result[2], data[2]);
    assert.notStrictEqual(result[3], data[3]);
  });

  it('success, newIntrinsicInstance - class instances with reserved constructor names', () => {
    const names = [
      'Array',
      'Date',
      'String',
      'Number',
      'Boolean',
      'Function',
      'RegExp',
      'Error',
      'Symbol',
      'BigInt',
      'WeakMap',
      'WeakSet',
      'Map',
      'Set',
      'ArrayBuffer',
      'DataView',
      'Promise',
      'Generator',
      'GeneratorFunction',
      'AsyncFunction',
      'ObjectId',
      'AsyncGenerator',
      'AsyncGeneratorFunction',
    ];

    for (const name of names) {
      const NamedClass = createNamedClass(name);
      const instance = new NamedClass();
      const result = newIntrinsicInstance(instance);
      assert.strictEqual(result, instance, `class ${name} should be returned as-is`);
    }
  });

  it('success, newIntrinsicInstance - custom class instance falls through clone', () => {
    class Foo {
      value = 1;
    }
    const instance = new Foo();
    const result = newIntrinsicInstance(instance);
    assert.strictEqual(result.value, 1);
    assert.notStrictEqual(result, instance);
  });
});
