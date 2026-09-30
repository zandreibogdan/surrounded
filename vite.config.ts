import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/surrounded/',
  plugins: [react()],
  build: {
    // Rapier embeds its WASM; keep it cached separately from UI and scene code.
    chunkSizeWarningLimit: 2400,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@dimforge/rapier')) return 'physics'
          if (id.includes('/three/') || id.includes('/three-stdlib/')) return 'three'
          if (id.includes('/node_modules/')) return 'vendor'
        },
      },
    },
  },
})
