import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@habitforge/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@habitforge/db': path.resolve(__dirname, '../../packages/db/src'),
    },
  },
})
