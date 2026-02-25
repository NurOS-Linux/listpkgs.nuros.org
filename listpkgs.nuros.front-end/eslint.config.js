// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import solid from 'eslint-plugin-solid';

export default tseslint.config(
  {
    ignores: ['node_modules', 'dist', 'build', '.vite', 'playwright.config.ts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...solid.configs['flat/typescript'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-console': ['warn', { 'allow': ['log', 'warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    },
  }
);
