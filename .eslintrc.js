module.exports = {
    extends: ['airbnb', 'prettier'],
    installedESLint: true,
    plugins: ['react', 'jsx-a11y', 'import', 'prettier'],
    rules: {
		'no-console': 0,
		'no-confusing-arrow': 0,
        'prettier/prettier': [
            'error',
            {
                trailingComma: "es5",
                singleQuote: true,
                tabWidth: 4,
                bracketSpacing: true,
            },
        ],
    },
    parserOptions: {
        ecmaVersion: 2016,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        es6: true,
        node: true,
    },
};
