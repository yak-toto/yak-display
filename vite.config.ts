import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig, type Plugin } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

import pkg from './package.json';

function frontendMetaPlugin(): Plugin {
  const content = JSON.stringify({ generatedFromBackend: pkg.backendApiVersion });
  return {
    name: 'frontend-meta',
    configureServer(server) {
      server.middlewares.use('/frontend-meta', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(content);
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'frontend-meta', source: content });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), frontendMetaPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});
