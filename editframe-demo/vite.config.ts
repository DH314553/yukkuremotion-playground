import path from 'node:path';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import {vitePluginEditframe} from '@editframe/vite-plugin';
import {viteSingleFile} from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [
    vitePluginEditframe({
      root: path.join(__dirname, 'src'),
      cacheRoot: path.join(__dirname, 'src', 'assets'),
    }),
    viteSingleFile(),
    react(),
  ],
});
