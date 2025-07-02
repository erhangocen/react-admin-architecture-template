module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',"prettier"
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'src/components/ui'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'unused-imports', "prettier"],
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
}
