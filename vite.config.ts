import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/patients': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/dentists': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/services': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/appointments': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    }
  },
  optimizeDeps: {
    include: ['lucide-react', 'react-icons', 'react-router-dom', '@reduxjs/toolkit', 'react-redux']
  }
})

