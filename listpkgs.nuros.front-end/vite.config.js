import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import path from 'path';
export default defineConfig({
    base: '/listpkgs.nuros.org/',
    plugins: [solid()],
    publicDir: 'public',
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
        },
    },
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
