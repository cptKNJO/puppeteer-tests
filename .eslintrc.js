module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    document: 'readonly',
    location: 'readonly',
    window: 'readonly',
    navigator: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'no-underscore-dangle': 'off',
    'no-restricted-globals': ['off'],
  },
};
