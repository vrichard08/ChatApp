module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'vue/multi-word-component-names': 0,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
};
