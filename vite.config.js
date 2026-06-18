import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site: https://<user>.github.io/lado/
export default defineConfig({
  base: '/lado/',
  plugins: [react()],
  server: { port: 5173, open: true },
});
