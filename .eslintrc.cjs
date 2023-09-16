module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.svelte', '*.ts'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  rules: {
    // General rules
    'no-unused-vars': 'error', // Enforce no unused variables
    '@typescript-eslint/no-unused-vars': 'error', // Enforce no unused TypeScript variables
    '@typescript-eslint/no-explicit-any': 'off', // Allow explicit 'any' types
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow omitting explicit return types

    // Formatting rules
    'space-before-function-paren': 'error', // Require space before function parentheses
    'no-multiple-empty-lines': 'error', // Disallow multiple empty lines
    'no-trailing-spaces': 'error', // Disallow trailing spaces
    'no-multi-spaces': 'error', // Disallow multiple consecutive spaces
    'no-irregular-whitespace': 'error', // Disallow irregular whitespace
    'no-useless-escape': 'error', // Disallow unnecessary escape characters
    'no-undef': 'error', // Disallow the use of undeclared variables
    'no-constant-condition': 'error', // Disallow constant conditions in if statements
    'newline-before-return': 'error', // Require a newline before 'return' statements
    'newline-after-var': 'error', // Require a newline after variable declarations
    'no-var': 'error', // Prefer 'let' or 'const' over 'var'
    'prefer-const': 'error', // Prefer 'const' over 'let' when variable won't be reassigned
    'space-before-blocks': 'error', // Require space before blocks
    'space-in-parens': 'error', // Require spaces inside parentheses
    'space-infix-ops': 'error', // Require spaces around infix operators
    'space-unary-ops': 'error', // Require spaces for unary operators
    'spaced-comment': 'error', // Require space after '//' in comments
  },
};
