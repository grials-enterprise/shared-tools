import { executeBasicFunctionString } from './executeFunctionString';

/**
 * A display string with its language translation.
 *
 * @category Data & JSON
 */
export interface IDisplay {
  _id?: string;
  language?: string;
  abbrevation?: string;
  value?: string;
}

/**
 * Describes an identifier type with its validations and translations.
 *
 * @category Data & JSON
 */
export interface IIdentifierType {
  _id?: string;
  condig?: {
    system?: string;
    version?: string;
    code?: string;
  }[];
  displays?: IDisplay[];
  acceptedCharacters?: string;
  format?: string;
  createdAt?: string;
  updatedAt?: string;
  validations?: {
    _id?: string;
    values?: string[];
    properties?: string[];
    _function?: string;
    errors?: {
      displays?: IDisplay[];
      text?: string;
    }[];
  }[];
  msgSuccess?: IDisplay[];
  msgInvalid?: IDisplay[];
}

/**
 * Validates an identifier against the rules (functions) defined in an
 * {@link IIdentifierType}.
 *
 * @param identifier - Identifier to validate.
 * @param identifierType - Identifier type with its validation rules.
 * @param lang - Language used to translate the error message. Defaults to `'en'`.
 * @returns `null` when valid, otherwise an error message string.
 *
 * @category Data & JSON
 */
export const validateIdentifierInput = (identifier: string, identifierType: IIdentifierType, lang?: string) => {
  let valid = null;
  const defaultError = 'The identifier is not valid';
  const language = lang ? lang : 'en';
  const validations = identifierType.validations ? identifierType.validations : [];
  try {
    for (const validation of validations) {
      const errors = validation.errors;
      const _function = validation._function || '';
      const properties = validation.properties || [];

      const result = executeBasicFunctionString(identifier, _function, properties[0]);
      if (typeof result === 'string') {
        const errorFound = errors?.find((item) => item?.text === result);

        if (errorFound) {
          const errorTradunction = errorFound.displays?.find((value) => value?.language === language);

          valid = errorTradunction?.value ? errorTradunction.value : defaultError;
        } else {
          valid = defaultError;
        }

        break;
      }
      if (!result) {
        valid = defaultError;
      }
    }
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    valid = null;
  }

  return valid;
};
