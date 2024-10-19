import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BACKEND_PORT = 8080;
const FRONTEND_PORT = 4000;

const PROXY_OPTIONS = {
  target: `http://localhost:${BACKEND_PORT}`,
  changeOrigin: true,
  secure: false,
};

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/build/src/dist',
    emptyOutDir: true,
  },
  server: {
    port: FRONTEND_PORT,
    proxy: {
      '/auth': PROXY_OPTIONS,
      '/paciente': PROXY_OPTIONS,
      '/plano-meta': PROXY_OPTIONS,
      '/receita': PROXY_OPTIONS,
      '/api': PROXY_OPTIONS,
    },
  },
});