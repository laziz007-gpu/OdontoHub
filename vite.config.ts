import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      tailwindcss(),
      react()
    ],
    define: {
      'import.meta.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL || '/')
    },
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
  }
})

