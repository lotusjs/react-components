import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    logo: '/logo.png'
  },
  extraBabelPresets: ['@emotion/babel-preset-css-prop']
});
