import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  base: '/listpkgs.nuros.org/',
  plugins: [solid()],
  publicDir: 'public',
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
