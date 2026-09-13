import prettier from 'eslint-plugin-prettier';
import parser from '@typescript-eslint/parser';

export default {
  files: ['src/**/*.ts'],
  plugins: {
    prettier,
  },
  languageOptions: {
    globals: {
      process: 'readonly',
      require: 'readonly',
      console: 'readonly',
      __dirname: 'readonly',
      module: 'readonly',
      AbortController: 'readonly',
      setTimeout: 'readonly',
      setInterval: 'readonly',
      clearTimeout: 'readonly',
      clearInterval: 'readonly',
    },
    parser,
  },
  ignores: ['public', 'node_modules', 'tests/**/*'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 120,
      },
    ],
    'max-lines-per-function': [
      'error',
      {
        max: 150,
        skipComments: true,
        skipBlankLines: true,
      },
    ],
    'arrow-spacing': ['error', { before: true, after: true }],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-multi-spaces': 'error',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'no-use-before-define': 'error',
    'no-console': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-dupe-args': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
  },
};
