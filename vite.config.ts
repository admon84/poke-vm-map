import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ],
  base: mode === 'production' ? '/poke-vm-map/' : '/', // GitHub repo name for production only
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: id => {
          // Split vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor'
            }
            if (id.includes('@vis.gl/react-google-maps')) {
              return 'maps-vendor'
            }
            if (
              id.includes('@radix-ui') ||
              id.includes('sonner') ||
              id.includes('lucide-react')
            ) {
              return 'ui-vendor'
            }
            // All other node_modules
            return 'vendor'
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
}))
