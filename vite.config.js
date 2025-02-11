import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/devinvoice-pro/', // Isso aqui!
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      external: []
    }
  }
});