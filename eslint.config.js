import globals from 'globals';
import pluginJs from '@eslint/js';
import jest from 'eslint-plugin-jest';

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    files: ['__tests__/**'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
      'import/prefer-default-export': 'off',
      'comma-dangle': 'never',
    },
  },
];
