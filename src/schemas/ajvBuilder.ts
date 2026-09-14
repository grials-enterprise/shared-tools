import Ajv, { AnySchema } from 'ajv';
import addFormats from 'ajv-formats';

/**
 * Registers standard string formats (email, date-time, etc.) from
 * `ajv-formats` and a custom `isDate` keyword on the given Ajv instance.
 *
 * The `isDate` keyword is a boolean that, when `true`, validates that the
 * data can be parsed as a date via `Date.parse`.
 *
 * @param ajv - Ajv instance to enhance.
 *
 * @category Schemas
 */
export const addNewFormatsToAjv = (ajv: any) => {
  addFormats(ajv);
  ajv.addKeyword({
    keyword: 'isDate',
    type: 'object',
    schemaType: 'boolean',
    compile: (schema: any, parentSchema: any) => {
      const validateFunction: any = (data: any) => (Date.parse(data) ? true : false);
      return parentSchema.isDate ? validateFunction : () => true;
    },
    error: {
      message: 'invalid date',
      params: { type: 'Date' },
    },
  });
};

/**
 * Error thrown by {@link startSchemasValidators} when a schema validation fails.
 *
 * @param errors - Ajv validation errors.
 * @param status - HTTP status code. Defaults to `422`.
 * @param msg - Error message. Defaults to `'Error'`. A leading code wrapped in
 *   brackets (e.g. `'[ISV001]: ...'`) is extracted into the error's `code` property.
 *
 * @category Schemas
 */
export function AjvValidatorError(errors: any, status?: any, msg?: any) {
  // @ts-ignore
  this.errors = errors;
  // @ts-ignore
  this.status = status || 422;
  // @ts-ignore
  this.msg = msg || 'Error';
  // @ts-ignore
  this.code = (msg || '').split(':')[0].trim().replace('[', '').replace(']', '') || '001';
}

/**
 * Creates an Ajv instance with the given schemas and returns helpers to
 * validate data by schema id.
 *
 * @example
 * ```ts
 * import { startSchemasValidators } from '@grials/shared-tools';
 *
 * const validators = startSchemasValidators([
 *   { $id: 'user', type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
 * ]);
 *
 * validators.validateData('user', { name: 'John' }); // ok
 * validators.validateData('user', {}); // throws AjvValidatorError (status 422, code 'ISV001')
 * ```
 *
 * @param schemaValidators - Optional list of JSON schemas to register.
 * @returns An object with the Ajv instance (`ajv`) and a `validateData(schemaId, data)` function
 *   that throws an {@link AjvValidatorError} when the data is invalid or the schema is not found.
 *
 * @category Schemas
 */
export const startSchemasValidators = (schemaValidators?: AnySchema[]) => {
  try {
    const ajv = new Ajv({ schemas: schemaValidators, allErrors: true });
    addNewFormatsToAjv(ajv);
    return {
      ajv,
      validateData: function (schemaValidatorId: string, data: any) {
        try {
          const ajvValidator = this.ajv.getSchema(schemaValidatorId);
          if (!ajvValidator) {
            throw new Error(`schema validator not found | ${schemaValidatorId}`);
          }

          if (!ajvValidator(data)) {
            // @ts-ignore
            throw new AjvValidatorError(ajvValidator.errors, 422, `[ISV001]: invalid schema ${schemaValidatorId}`);
          }
        } catch (error) {
          throw error;
        }
      },
    };
  } catch (error) {
    throw error;
  }
};
