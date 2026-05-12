import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'mood-music',
  brand: {
    displayName: '무드뮤직',
    primaryColor: '#7C3AED',
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite dev',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
