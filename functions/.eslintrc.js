module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 8,
  },
  extends: ['eslint:recommended', 'google', 'prettier'],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'require-jsdoc': 'off',
    'quotes': ['error', 'single'],
  },
};
