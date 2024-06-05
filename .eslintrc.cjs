/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // 美觀：格式化工具
    'prettier/prettier': [
      'warn',
      {
        //想要更多配置可以到prettier官網
        singleQuote: true, //字符串用單引號,保存時prettier會自動修
        semi: false, //無分號
        printWidth: 100, //每行寬度至少80字符
        trailingComma: 'none', //刪除最後多餘的逗號
        endOfLine: 'auto'
      }
    ],
    //規範:
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index']
        // vue組件名稱多單詞組成:忽略index.vue
      }
    ],
    'vue/no-setup-props-destructure': ['off'],
    //關閉props解構校驗
    'no-undef': 'error'
    //添加為定義變量報錯
  }
}
