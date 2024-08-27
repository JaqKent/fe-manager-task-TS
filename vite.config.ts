/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default ({ mode }: { mode: string }) => {
  const generateScopedName =
    mode === 'production' ? '__[hash:base64:2]' : '[local]_[hash:base64:2]';

  return defineConfig({
    plugins: [react()],
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./src/setupTest.ts'],
      css: true,
      coverage: {
        reporter: ['text', 'json-summary', 'json'],
        enabled: true,
        skipFull: false,
        provider: 'v8',
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName,
      },
    },
    resolve: {
      alias: [
        {
          find: '~lang',
          replacement: path.resolve(__dirname, 'src/lang'),
        },
        {
          find: '~components',
          replacement: path.resolve(__dirname, 'src/components'),
        },
        {
          find: '~screens',
          replacement: path.resolve(__dirname, 'src/screens'),
        },
        {
          find: '~config',
          replacement: path.resolve(__dirname, 'src/config'),
        },
        {
          find: '~utils',
          replacement: path.resolve(__dirname, 'src/utils'),
        },
        {
          find: '~assets',
          replacement: path.resolve(__dirname, 'src/assets'),
        },
        {
          find: '~hooks',
          replacement: path.resolve(__dirname, 'src/hooks'),
        },
        {
          find: '~contexts',
          replacement: path.resolve(__dirname, 'src/contexts'),
        },
        {
          find: '~constants',
          replacement: path.resolve(__dirname, 'src/constants'),
        },
        {
          find: '~styles',
          replacement: path.resolve(__dirname, 'src/styles'),
        },
      ],
    },
  });
};
