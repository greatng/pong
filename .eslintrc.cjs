const { rule } = require("postcss");

module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	rule: {
		'no-unused-vars': 'on',
		'@typescript-eslint/no-unused-vars': ['error'],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'space-before-function-paren': 'on',
		'no-multiple-empty-lines': 'on',
		'no-trailing-spaces': 'on',
		'no-multi-spaces': 'on',
		'no-irregular-whitespace': 'on',
		'no-useless-escape': 'on',
		'no-undef': 'on',
		'no-constant-condition': 'on',
		'newline-before-return': 'on',
		'newline-after-var': 'on',
		'no-var': 'on',
		'prefer-const': 'on',
	}
};
