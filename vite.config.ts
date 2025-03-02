import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://backendcontrolactivos-1.onrender.com/',
        changeOrigin: true,
        rewrite: (path: string) => path.startsWith('/api') ? path.substring(4) : path,
      },
    },
  },
});