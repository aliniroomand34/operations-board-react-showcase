/* eslint-env node */
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Public showcase: mock API only — no real backend proxy.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'dayjs/locale/fa': path.resolve(__dirname, 'node_modules/dayjs/locale/fa.js'),
    },
  },
  server: {
    host: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    server: {
      deps: {
        inline: ['jalaliday'],
      },
    },
  },
})
