import Ajv from 'ajv';
import assert from 'assert';
import { TEST_EXECUTE } from '../setup';
import { addNewFormatsToAjv, AjvValidatorError, startSchemasValidators } from '../../src/schemas';

const newAjvError = (errors: any, status?: any, msg?: any): any => new (AjvValidatorError as any)(errors, status, msg);

describe('schemas', function () {
  if (!(TEST_EXECUTE === 'ALL' || TEST_EXECUTE === '8')) {
    return;
  }

  describe('addNewFormatsToAjv', function () {
    it('success, isDate valid and invalid date', () => {
      const ajv = new Ajv({ allErrors: true });
      addNewFormatsToAjv(ajv);
      const validate = ajv.compile({ type: 'object', isDate: true });
      assert.strictEqual(validate(new Date()), true);
      assert.strictEqual(validate({}), false);
    });

    it('success, isDate false bypasses validation', () => {
      const ajv = new Ajv({ allErrors: true });
      addNewFormatsToAjv(ajv);
      const validate = ajv.compile({ type: 'object', isDate: false });
      assert.strictEqual(validate({}), true);
    });

    it('success, adds standard formats', () => {
      const ajv = new Ajv({ allErrors: true });
      addNewFormatsToAjv(ajv);
      const validate = ajv.compile({ type: 'string', format: 'email' });
      assert.strictEqual(validate('test@example.com'), true);
      assert.strictEqual(validate('not-an-email'), false);
    });
  });

  describe('AjvValidatorError', function () {
    it('success, defaults', () => {
      const err = newAjvError([]);
      assert.strictEqual(err.status, 422);
      assert.strictEqual(err.msg, 'Error');
      assert.strictEqual(err.code, '001');
      assert.deepStrictEqual(err.errors, []);
    });

    it('success, falsy status falls back to 422', () => {
      const err = newAjvError([], 0, 'x');
      assert.strictEqual(err.status, 422);
      assert.strictEqual(err.msg, 'x');
    });

    it('success, custom status and code extraction', () => {
      const err = newAjvError([{ a: 1 }], 400, '[CODE01]: message');
      assert.strictEqual(err.status, 400);
      assert.strictEqual(err.msg, '[CODE01]: message');
      assert.strictEqual(err.code, 'CODE01');
      assert.deepStrictEqual(err.errors, [{ a: 1 }]);
    });

    it('success, msg without colon keeps whole string', () => {
      const err = newAjvError([], 422, 'plain');
      assert.strictEqual(err.code, 'plain');
    });

    it('success, empty msg falls back to Error and 001', () => {
      const err = newAjvError([], 500, '');
      assert.strictEqual(err.status, 500);
      assert.strictEqual(err.msg, 'Error');
      assert.strictEqual(err.code, '001');
    });

    it('success, null msg falls back to 001', () => {
      const err = newAjvError([], 422, null);
      assert.strictEqual(err.code, '001');
    });
  });

  describe('startSchemasValidators', function () {
    it('success, returns ajv and validateData without schemas', () => {
      const validators = startSchemasValidators();
      assert.ok(validators.ajv);
      assert.strictEqual(typeof validators.validateData, 'function');
    });

    it('success, registers schemas passed in constructor', () => {
      const validators = startSchemasValidators([
        { $id: 'user', type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
      ]);
      assert.doesNotThrow(() => validators.validateData('user', { name: 'x' }));
    });

    it('success, validateData valid data passes', () => {
      const validators = startSchemasValidators([
        { $id: 'user', type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
      ]);
      validators.validateData('user', { name: 'John' });
    });

    it('error, validateData invalid data throws AjvValidatorError', () => {
      const validators = startSchemasValidators([
        { $id: 'user', type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
      ]);
      try {
        validators.validateData('user', {});
        assert.fail('should have thrown');
      } catch (err: any) {
        assert.strictEqual(err.status, 422);
        assert.strictEqual(err.code, 'ISV001');
        assert.strictEqual(err.msg, '[ISV001]: invalid schema user');
        assert.ok(Array.isArray(err.errors));
      }
    });

    it('error, validateData unknown schema throws not found', () => {
      const validators = startSchemasValidators();
      assert.throws(() => validators.validateData('missing', {}), /schema validator not found \| missing/);
    });

    it('error, startSchemasValidators invalid schema throws', () => {
      assert.throws(() => startSchemasValidators([{ type: 'unknown' } as any]));
    });

    it('success, isDate integration through validateData', () => {
      const validators = startSchemasValidators([{ $id: 'dated', type: 'object', isDate: true }]);
      validators.validateData('dated', new Date());
      try {
        validators.validateData('dated', {});
        assert.fail('should have thrown');
      } catch (err: any) {
        assert.strictEqual(err.status, 422);
      }
    });
  });
});
