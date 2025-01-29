// frontend/vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000', // Backend API proxy
    },
  },
});
