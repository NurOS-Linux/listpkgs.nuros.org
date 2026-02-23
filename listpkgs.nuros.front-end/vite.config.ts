import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  base: '/',
  plugins: [solid()],
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
});
