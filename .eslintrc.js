module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'semi': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'template-curly-spacing': ['error', 'always'],
    'spaced-comment': ['error', 'always', { 'exceptions': ['-', '+', '/'] }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
