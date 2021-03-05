module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'google', 'prettier'],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'require-jsdoc': 'off',
    'quotes': ['error', 'single'],
  },
};
