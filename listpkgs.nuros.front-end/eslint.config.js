// eslint.config.js
import js from '@eslint/js';
import solid from 'eslint-plugin-solid';

export default [
  js.configs.recommended,
  solid.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-console': ['warn', { 'allow': ['log', 'warn', 'error'] }]
    }
  }
];