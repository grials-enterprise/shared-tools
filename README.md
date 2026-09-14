# @grials/shared-tools

Shared utilities and helpers for Grials projects.

[![npm version](https://img.shields.io/npm/v/@grials/shared-tools)](https://www.npmjs.com/package/@grials/shared-tools)
[![license](https://img.shields.io/npm/l/@grials/shared-tools)](./LICENSE)

## Installation

```bash
npm install @grials/shared-tools
```

## Quick start

```ts
import { JobHandler, applyStringMask, startSchemasValidators } from '@grials/shared-tools';

// Async jobs
const handler = new JobHandler();
setTimeout(() => handler.completeJob('job-1', { ok: true }), 500);
const result = await handler.startNewJob('job-1', '1s'); // { ok: true }

// String masks
applyStringMask('000000000-0', '123456789'); // '12345678-9'

// JSON schema validation
const validators = startSchemasValidators([
  { $id: 'user', type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
]);
validators.validateData('user', { name: 'John' }); // ok
```

## API reference

The full API reference is generated with [TypeDoc](https://typedoc.org) and published on
[GitHub Pages](https://grials-enterprise.github.io/shared-tools/).

To generate it locally:

```bash
npm run docs        # generates ./docs
npm run docs:watch  # regenerate on change
```

### Modules

- **Classes** — `JobHandler`, `TimeQueue` and their related types.
- **Schemas** — Ajv helpers: `startSchemasValidators`, `addNewFormatsToAjv`, `AjvValidatorError`.
- **Utils**
  - **Date** — `convertMinutesToTimeAmPm`, `convertMinutesToTime24`, `getDateWithMonthRange`, `parseTimeToMiliseconds`, `parseDateWithOffset`
  - **String & Formatting** — `applyStringMask`, `createExamOrderNumber`, `executeBasicFunctionString`, `formatValueToStringOrNumber`, `validateStringChartAccepted`
  - **Data & JSON** — `getAllJsonKeyAndValues`, `removeNullAndUndefinedValues`, `validateArrayValues`, `validateObjectValues`, `validateIdentifierInput`, `newValueInstance`, `newIntrinsicInstance`
  - **Number** — `getNumberOfDecimals`, `parseNumber`
  - **Async & HTTP** — `intervalWithRetries`, `sendSlackMessage`, `getExternalResource`, `postExternalResource`, `patchExternalResource`, `deleteExternalResource`

## Development

```bash
npm install        # install dependencies
npm run build      # compile TypeScript
npm run lint       # lint the source
npm test           # run tests with coverage
npm run docs       # generate the API documentation
```

## License

[MIT](./LICENSE)
