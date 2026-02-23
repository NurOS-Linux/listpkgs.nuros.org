// eslint.config.js
import js from '@eslint/js';
import typescript from 'typescript-eslint';
import solid from 'eslint-plugin-solid';

export default [
  {
    ignores: ['node_modules', 'dist', 'build', '.vite']
  },
  js.configs.recommended,
  ...typescript.configs.recommended,
  solid.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: typescript.parser,
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
      'no-console': ['warn', { 'allow': ['log', 'warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { 'argsIgnorePattern': '^_' }
      ],
      'solid/reactivity': 'warn',
      'solid/no-destructure': 'warn'
    }
  },
  {
    files: ['*.js', '*.jsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module'
    }
  }
];