import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  base: '/listpkgs.nuros.org/',
  plugins: [solid()],
  css: {
    preprocessorOptions: {
      scss: {}
    }
  }
})
