import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: '@hocgin/marks',
  },
  ssr: process.env.NODE_ENV === 'development' ? false : {},
});
